import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import { productService, promotionService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth } from "date-fns";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

interface InsuranceOption {
  id: string;
  name: string;
}

export function useCampaignReport() {
  const router = useRouter();
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [sortBy, setSortBy] = useState<string>("date");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [selectedInsurance, setSelectedInsurance] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Report.Read");
      const deleteBtn = permissionList.includes("Report.Delete");
      const editBtn = permissionList.includes("Report.Update");

      setCanDelete(deleteBtn);
      setCanEdit(editBtn);
      setHasAccess(access);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const { data: insuranceOptions = [] } = useQuery<InsuranceOption[]>({
    queryKey: ["insurance-options"],
    queryFn: async () => {
      const response = await productService.get(ApiURL.v1Insurances);
      return response.data.data.map(
        (insurance: { id: string; name: string }) => ({
          id: insurance.id,
          name: insurance.name,
        })
      );
    },
    enabled: hasAccess === true && filterBy === "insurance",
    staleTime: 300000,
  });

  const { data: campaignReportData, isLoading: isLoadingReports } = useQuery({
    queryKey: [
      "campaign-reports",
      page,
      rowsPerPage,
      sortBy,
      filterBy,
      selectedInsurance,
      date,
    ],
    queryFn: async () => {
      const params: any = {
        page,
        limit: rowsPerPage,
        sort: sortBy,
        dateFrom: date?.from,
        dateTo: date?.to,
      };

      let endpoint = ApiURL.v1CampaignReport;

      if (filterBy === "insurance" && selectedInsurance) {
        endpoint = ApiURL.v1CampaignReportInsurance;
        params.insurance = selectedInsurance;
      } else {
        params.filter = filterBy;
      }

      const response = await promotionService.get(endpoint, { params });

      return {
        data: response.data?.data || [],
        total: response.data?.total || 0,
        pageTotal: response.data?.pageTotal || 1,
      };
    },
    enabled:
      hasAccess === true && (filterBy !== "insurance" || !!selectedInsurance),
    staleTime: 0,
  });

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setFilterBy(value);
    setPage(1);
    if (value !== "insurance") {
      setSelectedInsurance(undefined);
    }
  }, []);

  const handleInsuranceChange = useCallback((value: string) => {
    setSelectedInsurance(value);
    setPage(1);
  }, []);

  const handleDateChange = useCallback((range: DateRange | undefined) => {
    setDate(range);
    setPage(1);
  }, []);

  const handleClear = useCallback(() => {
    setDate(undefined);
    setPage(1);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const handleDownloadReport = useCallback(async () => {
    try {
      const params: any = {
        sort: sortBy,
        dateFrom: date?.from,
        dateTo: date?.to,
      };

      let endpoint = ApiURL.v1CampaignReportExport;

      if (filterBy === "insurance" && selectedInsurance) {
        endpoint = ApiURL.v1CampaignReportExportInsurance;
        params.insurance = selectedInsurance;
      }

      const response = await promotionService.get(endpoint, { params });

      const reportData = response.data.data.map((promotion: any) => ({
        "Campaign Name": promotion.campaign_name || "",
        Type: promotion.type || "",
        "Insurance Company Name": promotion.insurance_name || "N/A",
        "Plan Name": promotion.plan_name || "N/A",
        ...(filterBy !== "insurance" && {
          Currency: promotion.currency || "N/A",
        }),
        "Transaction Amount": promotion.total_transaction_amount || 0,
        "Discount Amount":
          promotion.total_transaction_amount -
            promotion.total_discount_amount || 0,
        "Transaction Amount after Discount":
          promotion.total_discount_amount || 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(reportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Campaign Report");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Campaign_Report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Failed to download the report:", error);
      toast.error("Failed to download report. Please try again.");
    }
  }, [filterBy, selectedInsurance, sortBy, date]);

  return {
    promotions: campaignReportData?.data || [],
    insuranceOptions,
    totalItems: campaignReportData?.total || 0,
    totalPages: campaignReportData?.pageTotal || 1,

    page,
    rowsPerPage,
    date,
    sortBy,
    filterBy,
    selectedInsurance,
    hasAccess,
    canDelete,
    canEdit,

    isLoadingReports,

    setPage,
    handleSortChange,
    handleFilterChange,
    handleInsuranceChange,
    handleDateChange,
    handleClear,
    handleRowsPerPageChange,
    handleDownloadReport,
  };
}
