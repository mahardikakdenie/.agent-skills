import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { policyService } from "@/services/policy/api/policy.service";
import { useAuth } from "@/context/auth.context";

interface ExportPolicyFilters {
  status?: string;
  search?: string;
  channel?: string;
  category?: string;
  date_from?: string;
  date_to?: string;
}

interface UseExportPolicyProps {
  data: any[];
  isLoading: boolean;
  isGeneratingXlsx: boolean;
  isShowPremi: boolean;
  isShowDanaInfo: boolean;
  reportTemplateRef: React.RefObject<HTMLTableElement>;
  handleGeneratePdf: () => void;
  handleGenerateXlsx: () => void;
}

export default function useExportPolicy(): UseExportPolicyProps {
  const { permissionList } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [isGeneratingXlsx, setIsGeneratingXlsx] = useState(false);
  const [isShowPremi, setIsShowPremi] = useState<boolean>(false);
  const [isShowDanaInfo, setIsShowDanaInfo] = useState<boolean>(false);
  const reportTemplateRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const withPremi = permissionList.includes("Policy.Export.withPremi");
    const withDanaInfo = permissionList.includes("Policy.Export.withDanaInfo");
    setIsShowPremi(withPremi);
    setIsShowDanaInfo(withDanaInfo);
  }, [permissionList]);

  const getFilters = useCallback((): ExportPolicyFilters | null => {
    const savedData = localStorage.getItem("exportPolicyData");
    if (!savedData) return null;

    const parsedData = JSON.parse(savedData);
    return {
      status: parsedData.status ?? "All",
      search: parsedData.search ?? "",
      channel: parsedData.channel,
      category: parsedData.category,
      date_from: parsedData.date_from,
      date_to: parsedData.date_to,
    };
  }, []);

  const { isLoading } = useQuery({
    queryKey: ["export-policies", getFilters()],
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
            keyword: filters.search ? filters.search : undefined,
            status:
              filters.status && filters.status !== "All"
                ? filters.status
                : undefined,
            channel: filters.channel ? filters.channel : undefined,
            category:
              filters.category && filters.category !== "All"
                ? filters.category
                : undefined,
            created_from: filters.date_from ? filters.date_from : undefined,
            created_to: filters.date_to ? filters.date_to : undefined,
          };

          const res: any = await policyService.getPolicies(params);

          if (res?.data) {
            allData = [...allData, ...res.data];
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
    enabled: !!getFilters(),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

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

    autoTable(doc, {
      head: [["No.", "Customer Name", "Policy Number", "Plan Name", "Status"]],
      body: data.map((item, index) => [
        index + 1,
        item.policy_holder?.name || "-",
        item?.number || "-",
        item?.policy_products?.plan_data?.name.split("|").join(" - ") || "-",
        item.status || "-",
      ]),
      startY: 30,
      headStyles: {
        textColor: "black",
        fontStyle: "bold",
        fontSize: 10,
        fillColor: [231, 231, 231],
      },
      bodyStyles: {
        textColor: "black",
        fontSize: 10,
      },
    });

    const date = moment();
    const formattedDate = date.format("YYYY_MM_DD");
    doc.save(`policylist_${formattedDate}.pdf`);
  }, [data]);

  const handleGenerateXlsx = useCallback(async () => {
    if (data.length === 0) {
      console.error("No data to export.");
      return;
    }

    setIsGeneratingXlsx(true);

    setTimeout(async () => {
      try {
        const sheetData = data.map((item, index) => {
          let additionColumn = {};

          if (isShowPremi) {
            additionColumn = {
              ...additionColumn,
              Premium:
                item.declarations?.transaction_data?.insurance?.premium || "-",
            };
          }

          if (isShowDanaInfo) {
            let thisParty = item.declarations?.transaction_data?.third_party;
            if (thisParty) {
              if (thisParty?.provider === "DANA") {
                additionColumn = {
                  ...additionColumn,
                  "Order Id": thisParty?.identifiers?.order_id,
                  "Request Id": thisParty?.identifiers?.request_id,
                  "License Plate":
                    item.declarations?.transaction_data?.participants[0]?.data
                      ?.licensePlate ||
                    item.declarations?.transaction_data?.participants[0]?.data
                      ?.plat_number ||
                    "-",
                };
              }
            }
          }

          return {
            No: index + 1,
            "Customer Name": item.policy_holder?.name || "-",
            "Policy Number": item.number || "-",
            "Plan Name":
              item.policy_products?.plan_data?.name?.split("|").join(" - ") ||
              "-",
            Status: item.status || "-",
            "Issued Date": !!item.created_at
              ? moment(item.created_at).format("LL HH:mm:ss")
              : "-",
            ...additionColumn,
          };
        });

        const worksheet = XLSX.utils.json_to_sheet(sheetData);

        const columnWidths: Record<string, number> = {};
        columnWidths["No"] = 30;
        columnWidths["Customer Name"] = 100;
        columnWidths["Policy Number"] = 150;
        columnWidths["Plan Name"] = 500;
        columnWidths["Status"] = 100;

        worksheet["!cols"] = Object.keys(columnWidths).map((key) => ({
          wpx: columnWidths[key],
        }));

        const workbook = XLSX.utils.book_new();

        const date = moment();
        const formattedDate = date.format("YYYY_MM_DD");
        let name = `policylist_${formattedDate}`;

        XLSX.utils.book_append_sheet(workbook, worksheet, "policylist");
        XLSX.writeFile(workbook, `${name}.xlsx`);
      } catch (error) {
        console.error("Error generating XLSX:", error);
      } finally {
        setIsGeneratingXlsx(false);
      }
    }, 100);
  }, [data, isShowPremi, isShowDanaInfo]);

  return {
    data,
    isLoading,
    isGeneratingXlsx,
    isShowPremi,
    isShowDanaInfo,
    reportTemplateRef,
    handleGeneratePdf,
    handleGenerateXlsx,
  };
}
