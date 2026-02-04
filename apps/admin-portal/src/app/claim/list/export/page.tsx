// "use client";
//
// import React from "react";
// import {ClaimExportView} from "@/views/claim/export/export.view";
//
// export default function ClaimExportPage() {
//     return <ClaimExportView />;
// }

"use client";
import jsPDF from "jspdf";
import moment from "moment";
import * as XLSX from "xlsx";
import Image from "next/image";
import autoTable from "jspdf-autotable";
import Spinner from "@/components/ui/spinner";
import noData from "/public/images/no-data.webp";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatMoneyClaim } from "@/lib/formatter";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Download } from "react-feather";
import ApiURL from "@/constants/api-url.const";
import { channelService, claimService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export default function ExportPage() {
  const [channel, setChannel] = useState<string | undefined>(undefined);

  const { data: channelConfigurations } = useQuery({
    queryKey: ["channelConfigurations", channel],
    queryFn: async () => {
      const res = await channelService.get(ApiURL.channelConfigurations, {
        params: {
          ...(channel && { channel }),
        },
      });
      return res.data;
    },
    enabled: !!channel,
  });

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const savedData = localStorage.getItem("exportClaimData");
        if (!savedData) return;

        const parsedData = JSON.parse(savedData);
        if (parsedData.channel) setChannel(parsedData.channel);

        const params = {
          page: parsedData.page ?? 1,
          limit: 150,
          ...(parsedData.search && { keyword: parsedData.search }),
          ...(parsedData.status &&
            parsedData.status !== "All" && { status: parsedData.status }),
          ...(parsedData.sla_status &&
            parsedData.sla_status !== "All" && {
              sla_status: parsedData.sla_status,
            }),
          ...(parsedData.date_from && { date_from: parsedData.date_from }),
          ...(parsedData.date_to && { date_to: parsedData.date_to }),
          ...(parsedData.channel && { channel: parsedData.channel }),
        };

        const res = await claimService.get(ApiURL.v1Claims, { params });

        const filteredData = res.data?.data?.filter(
          (item: any) => item.status !== "Draft",
        );

        setData(filteredData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reportTemplateRef = useRef(null);

  const handleGeneratePdf = () => {
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

    const isGrabExpress =
      channelConfigurations &&
      channelConfigurations?.data[0]?.other?.show_channel_info?.GRAB_EXPRESS;

    const getClaimConfigValue = (item: any, name: string) => {
      const config = item?.claim_config?.find((c: any) => c.name === name);
      return config?.value || "-";
    };

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
          (page - 1) * rowsPerPage + index + 1,
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
  };

  const handleGenerateXlsx = () => {
    if (data.length === 0) {
      console.error("No data to export.");
      return;
    }

    const isGrabExpress =
      channelConfigurations &&
      channelConfigurations?.data[0]?.other?.show_channel_info?.GRAB_EXPRESS;

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

    const getClaimConfigValue = (item: any, name: string) => {
      const config = item?.claim_config?.find((c: any) => c.name === name);
      return config?.value || "-";
    };

    const sheetData = data.map((item, index) => {
      const baseData: any = {
        No: (page - 1) * rowsPerPage + index + 1,
        "Claim ID": item.number || "-",
        "Customer Name": item?.policy_data?.policy_holder?.name || "-",
        "Plan Name": item?.package?.plan?.name.split("|").join(" - ") || "-",
        Benefit: item?.benefit?.description_en || "-",
        Currency: item?.currency || "-",
        "Requested Amount": getReqAmount(item),
        "Approved Amount": getApprovedAmount(item),
        Status: item.status || "-",
      };

      if (isGrabExpress) {
        baseData["Booking ID"] = getClaimConfigValue(item, "order_id");
        baseData["Tanggal Claim"] = getClaimConfigValue(
          item,
          "datetime_loss_damage",
        );
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
      columnWidths["Booking ID"] = 150;
      columnWidths["Tanggal Claim"] = 150;
    }
    // Set the width for each column
    worksheet["!cols"] = Object.keys(columnWidths).map((key) => ({
      wpx: columnWidths[key], //adjust multiplier for better fit
    }));

    const workbook = XLSX.utils.book_new();

    const date = moment();
    const formattedDate = date.format("YYYY_MM_DD");
    let name = `claimlist_${formattedDate}`;

    XLSX.utils.book_append_sheet(workbook, worksheet, "claimlist");
    XLSX.writeFile(workbook, `${name}.xlsx`);
  };

  const styles = {
    table: {
      width: "100%",
      border: "0.5px solid #cccccc",
    },
    th: {
      padding: "10px",
      border: "0.5px solid #cccccc",
      fontWeight: "bold",
      fontSize: "12px",
      height: "auto",
      background: "#e7e7e7",
      verticalAlign: "middle",
    },
    td: {
      padding: "10px",
      height: "auto",
      border: "0.5px solid #cccccc",
      fontSize: "12px",
      verticalAlign: "middle",
    },
  };

  const isGrabExpress =
    channelConfigurations &&
    channelConfigurations?.data[0]?.other?.show_channel_info?.GRAB_EXPRESS;

  const getClaimConfigValue = (item: any, name: string) => {
    const config = item?.claim_config?.find((c: any) => c.name === name);
    return config?.value || "-";
  };

  const getReqAmountUi = (item: any): string => {
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

  const getApprovedAmountUi = (item: any): string => {
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

  return (
    <div className="flex flex-col w-full p-4 md:p-6 h-screen overflow-auto">
      <div className="flex gap-4 mb-5">
        <h1 className="text-black font-bold text-2xl mt-2">Claim List</h1>
        <div
          onClick={() => router.back()}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </div>

        <Button
          onClick={handleGeneratePdf}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs"
        >
          <Download className="w-5 h-5 mr-1 " /> Generate PDF
        </Button>

        <Button
          onClick={handleGenerateXlsx}
          className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs"
        >
          <Download className="w-5 h-5 mr-1 " /> Generate XLSX
        </Button>
      </div>
      <div className="w-full bg-white rounded-lg">
        {isLoading ? (
          <div className="flex gap-2 flex-col justify-center items-center py-20 text-sm">
            <Spinner /> Loading...
          </div>
        ) : (
          <table style={styles.table} ref={reportTemplateRef} border={1}>
            <thead>
              <tr>
                <td style={styles.th} valign="middle">
                  No.
                </td>
                <td style={styles.th} valign="middle">
                  Claim ID
                </td>
                <td style={styles.th} valign="middle">
                  Customer Name
                </td>
                <td style={styles.th} valign="middle">
                  Plan Name
                </td>
                <td style={styles.th} valign="middle">
                  Benefit
                </td>
                <td style={styles.th} valign="middle">
                  Currency
                </td>
                <td style={styles.th} valign="middle">
                  Requested Amount
                </td>
                <td style={styles.th} valign="middle">
                  Approved Amount{" "}
                </td>
                <td style={styles.th} valign="middle">
                  Status
                </td>
                {isGrabExpress && (
                  <>
                    <td style={styles.th} valign="middle">
                      Booking ID
                    </td>
                    <td style={styles.th} valign="middle">
                      Tanggal Claim
                    </td>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id}>
                    <td style={styles.td} valign="middle">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td style={styles.td} valign="middle">
                      <div className="flex gap-2 items-center">
                        {item.number || "-"}
                      </div>
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.policy_data?.policy_holder?.name || "-"}
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.package?.plan?.name.split("|").join(" - ") || "-"}
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.benefit?.description_en || "-"}
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.currency || "-"}
                    </td>
                    <td style={styles.td} valign="middle">
                      {getReqAmountUi(item)}
                    </td>
                    <td style={styles.td} valign="middle">
                      <div className="flex gap-2 items-center">
                        {getApprovedAmountUi(item)}
                      </div>
                    </td>
                    <td style={styles.td} valign="middle">
                      {item.status}
                    </td>
                    {isGrabExpress && (
                      <>
                        <td style={styles.td} valign="middle">
                          {getClaimConfigValue(item, "order_id")}
                        </td>
                        <td style={styles.td} valign="middle">
                          {getClaimConfigValue(item, "datetime_loss_damage")}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr className="hover:!bg-white">
                  <td colSpan={isGrabExpress ? 11 : 9}>
                    <div className="flex flex-col gap-4 items-center justify-center py-14">
                      <Image alt="no data" src={noData} width={200} /> No
                      transaction data available
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
