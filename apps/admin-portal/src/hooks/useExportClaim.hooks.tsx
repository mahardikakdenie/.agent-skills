import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { channelService } from "@/services/channel/api/channel.service";
import { claimsService } from "@/services/claims/api/claims.service";
import { formatMoneyClaim } from "@/lib/formatter";

interface UseExportClaimProps {
  data: any[];
  isLoading: boolean;
  isGrabExpress: boolean;
  channel: string | undefined;
  reportTemplateRef: React.RefObject<HTMLTableElement>;
  handleGeneratePdf: () => void;
  handleGenerateXlsx: () => void;
  getReqAmountUi: (item: any) => string;
  getApprovedAmountUi: (item: any) => string;
  getClaimConfigValue: (item: any, name: string) => string;
}

export default function useExportClaim(): UseExportClaimProps {
  const [data, setData] = useState<any[]>([]);
  const reportTemplateRef = useRef<HTMLTableElement>(null);

  const getFilters = useCallback(() => {
    const savedData = localStorage.getItem("exportClaimData");
    if (!savedData) return null;

    const parsedData = JSON.parse(savedData);

    return {
      status: parsedData.status ?? "All",
      search: parsedData.search ?? "",
      channel: parsedData.channel,
      sla_status: parsedData.sla_status,
      date_from: parsedData.date_from,
      date_to: parsedData.date_to,
    };
  }, []);

  const channel = getFilters()?.channel;

  const { data: channelConfigurations } = useQuery({
    queryKey: ["channelConfigurations", channel],
    queryFn: async () => {
      return channelService.getChannelConfigurations({
        ...(channel && { channel }),
      });
    },
    enabled: !!channel,
  });

  const channelConfigurationsData: any = channelConfigurations;
  const isGrabExpress =
    channelConfigurationsData &&
    channelConfigurationsData?.data?.[0]?.other?.show_channel_info
      ?.GRAB_EXPRESS;

  const { isLoading } = useQuery({
    queryKey: ["export-claims", getFilters()],
    queryFn: async () => {
      const filters = getFilters();
      if (!filters) return [];

      const rowsPerPage = 100;
      let allData: any[] = [];
      let currentPage = 1;
      let totalRecords = 0;

      do {
        try {
          const params = {
            page: currentPage,
            limit: rowsPerPage,
            ...(filters.search && { keyword: filters.search }),
            ...(filters.status &&
              filters.status !== "All" && { status: filters.status }),
            ...(filters.sla_status &&
              filters.sla_status !== "All" && {
                sla_status: filters.sla_status,
              }),
            ...(filters.date_from && { date_from: filters.date_from }),
            ...(filters.date_to && { date_to: filters.date_to }),
            ...(filters.channel && { channel: filters.channel }),
          };

          const res: any = await claimsService.getClaims(params as any);

          if (res?.data) {
            const filteredData = res.data.filter(
              (item: any) => item.status !== "Draft",
            );
            allData = [...allData, ...filteredData];
            totalRecords = res.total || 0;
          }
        } catch (pageError) {
          console.error(`Error fetching page ${currentPage}:`, pageError);
        }

        currentPage++;
      } while (allData.length < totalRecords && totalRecords > 0);

      setData(allData);
      return allData;
    },
    enabled: !!getFilters(), // Only fetch if filters are available
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const getClaimConfigValue = useCallback((item: any, name: string) => {
    const config = item?.claim_config?.find((c: any) => c.name === name);
    return config?.value || "-";
  }, []);

  const getReqAmountUi = useCallback(
    (item: any): string => {
      if (isGrabExpress) {
        const amount = Number(item.amount);
        return !isNaN(amount) ? formatMoneyClaim(amount) : "-";
      }
      const claimValue = item.claim?.find(
        (d: any) => d.type === "Number" && d.name === "claim",
      )?.value;

      const numericValue = Number(claimValue);

      return !isNaN(numericValue) ? formatMoneyClaim(numericValue) : "-";
    },
    [isGrabExpress],
  );

  const getApprovedAmountUi = useCallback(
    (item: any): string => {
      if (isGrabExpress) {
        const amountApproved = Number(item.amount_approved);
        return !isNaN(amountApproved)
          ? formatMoneyClaim(amountApproved)
          : formatMoneyClaim(0);
      }
      return formatMoneyClaim(
        item.amount_approved != null ? item.amount_approved : 0,
      );
    },
    [isGrabExpress],
  );

  const handleGeneratePdf = useCallback(() => {
    if (!reportTemplateRef.current) {
      console.error("Template element is not found.");
      return;
    }

    const doc = new jsPDF({
      format: "a1",
      unit: "px",
    });
    doc.setFontSize(10);
    doc.setFont("Inter-Regular", "normal");

    const getReqAmount = (item: any): string => {
      if (isGrabExpress) {
        const amount = Number(item.amount);
        return !isNaN(amount) ? formatMoneyClaim(amount) : "-";
      }
      const claimValue = item.claim?.find(
        (d: any) => d.type === "Number" && d.name === "claim",
      )?.value;
      const numericValue = Number(claimValue);
      return !isNaN(numericValue) ? formatMoneyClaim(numericValue) : "-";
    };

    const getApprovedAmount = (item: any): string => {
      if (isGrabExpress) {
        const amountApproved = Number(item.amount_approved);
        return !isNaN(amountApproved)
          ? formatMoneyClaim(amountApproved)
          : formatMoneyClaim(0);
      }
      return formatMoneyClaim(
        item.amount_approved != null ? item.amount_approved : 0,
      );
    };

    const getStatus = (item: any): string => {
      if (isGrabExpress) {
        return item.status || "-";
      }
      return item.status || "-";
    };

    const head = [
      "No.",
      "Claim ID",
      "Customer Name",
      "Plan Name",
      "Benefit",
      "Currency",
      "Requested Amount",
      "Approved Amount",
      "Status",
    ];

    if (isGrabExpress) {
      head.push("Booking ID", "Tanggal Claim");
    }

    autoTable(doc, {
      head: [head],
      body: data.map((item, index) => {
        const row = [
          index + 1,
          item.number || "-",
          item?.policy_data?.policy_holder?.name || "-",
          item?.package?.plan?.name.split("|").join(" - ") || "-",
          item?.benefit?.description_en || "-",
          item?.currency || "-",
          getReqAmount(item),
          getApprovedAmount(item),
          getStatus(item),
        ];

        if (isGrabExpress) {
          row.push(
            getClaimConfigValue(item, "order_id"),
            getClaimConfigValue(item, "datetime_loss_damage"),
          );
        }
        return row;
      }),
      startY: 30,
      headStyles: {
        textColor: "black",
        fontStyle: "bold",
        fontSize: 10,
        fillColor: [231, 231, 231], //grey
      },
      bodyStyles: {
        textColor: "black",
        fontSize: 10,
      },
    });
    const date = moment();
    const formattedDate = date.format("YYYY_MM_DD");
    doc.save(`claimlist_${formattedDate}.pdf`);
  }, [data, isGrabExpress, getClaimConfigValue]);

  const handleGenerateXlsx = useCallback(() => {
    if (data.length === 0) {
      console.error("No data to export.");
      return;
    }

    const getReqAmount = (item: any): string => {
      if (isGrabExpress) {
        const amount = Number(item.amount);
        return !isNaN(amount) ? formatMoneyClaim(amount) : "-";
      }
      const claimValue = item.claim?.find(
        (d: any) => d.type === "Number" && d.name === "claim",
      )?.value;

      const numericValue = Number(claimValue);

      return !isNaN(numericValue) ? formatMoneyClaim(numericValue) : "-";
    };

    const getApprovedAmount = (item: any): string => {
      if (isGrabExpress) {
        const amountApproved = Number(item.amount_approved);
        return !isNaN(amountApproved)
          ? formatMoneyClaim(amountApproved)
          : formatMoneyClaim(0);
      }
      return formatMoneyClaim(
        item.amount_approved != null ? item.amount_approved : 0,
      );
    };

    const excludedTypes = ["multiple file", "file"];
    let claimConfigLabels: string[] = [];

    if (isGrabExpress && data.length > 0) {
      const firstItemConfig = data[0]?.claim_config;
      if (Array.isArray(firstItemConfig)) {
        claimConfigLabels = firstItemConfig
          .filter((c: any) => !excludedTypes.includes(c.type))
          .map((c: any) => c.label);
      }
    }

    const sheetData = data.map((item, index) => {
      const baseData: any = {
        No: index + 1,
        "Claim ID": item.number || "-",
        "Customer Name": item?.policy_data?.policy_holder?.name || "-",
        "Plan Name": item?.package?.plan?.name.split("|").join(" - ") || "-",
        Benefit: item?.benefit?.description_en || "-",
        Currency: item?.currency || "-",
        "Requested Amount": getReqAmount(item),
        "Approved Amount": getApprovedAmount(item),
        Status: item.status || "-",
      };

      if (isGrabExpress && Array.isArray(item?.claim_config)) {
        item.claim_config
          .filter((c: any) => !excludedTypes.includes(c.type))
          .forEach((c: any) => {
            baseData[c.label] = c.value || "-";
          });
      }

      return baseData;
    });

    const worksheet = XLSX.utils.json_to_sheet(sheetData);

    const columnWidths: Record<string, number> = {};
    columnWidths["No"] = 30;
    columnWidths["Claim ID"] = 150;
    columnWidths["Customer Name"] = 100;
    columnWidths["Plan Name"] = 700;
    columnWidths["Benefit"] = 300;
    columnWidths["Currency"] = 80;
    columnWidths["Requested Amount"] = 120;
    columnWidths["Approved Amount"] = 120;
    columnWidths["Status"] = 100;

    if (isGrabExpress) {
      claimConfigLabels.forEach((label) => {
        columnWidths[label] = 200;
      });
    }
    worksheet["!cols"] = Object.keys(columnWidths).map((key) => ({
      wpx: columnWidths[key],
    }));

    const workbook = XLSX.utils.book_new();

    const date = moment();
    const formattedDate = date.format("YYYY_MM_DD");
    let name = `claimlist_${formattedDate}`;

    XLSX.utils.book_append_sheet(workbook, worksheet, "claimlist");
    XLSX.writeFile(workbook, `${name}.xlsx`);
  }, [data, isGrabExpress, getClaimConfigValue]);

  return {
    data,
    isLoading,
    isGrabExpress,
    channel,
    reportTemplateRef,
    handleGeneratePdf,
    handleGenerateXlsx,
    getReqAmountUi,
    getApprovedAmountUi,
    getClaimConfigValue,
  };
}
