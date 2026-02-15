import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import { promotionService } from "@/services/promotion/api/promotion.service";
import { useCampaignReport as useCampaignReportQuery } from "@/services/promotion/hooks/queries/useCampaignReport";
import { useCampaignReportInsurance } from "@/services/promotion/hooks/queries/useCampaignReportInsurance";
import { useInsurances } from "@/services/product/hooks/queries/useInsurances";
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

  const { data: insuranceResponse } = useInsurances(undefined, {
    enabled: hasAccess === true && filterBy === "insurance",
    staleTime: 300000,
  });
  const insuranceOptions: InsuranceOption[] = (
    (insuranceResponse as any)?.data || []
  ).map((insurance: { id: string; name: string }) => ({
    id: insurance.id,
    name: insurance.name,
  }));

  const reportBaseParams = {
    page,
    limit: rowsPerPage,
    sort: sortBy,
    dateFrom: date?.from,
    dateTo: date?.to,
  };

  const { data: campaignReportDataAll, isLoading: isLoadingAllReports } =
    useCampaignReportQuery(
      {
        ...reportBaseParams,
        filter: filterBy,
      },
      {
        enabled: hasAccess === true && filterBy !== "insurance",
        staleTime: 0,
      }
    );

  const {
    data: campaignReportDataInsurance,
    isLoading: isLoadingInsuranceReports,
  } = useCampaignReportInsurance(
    {
      ...reportBaseParams,
      insurance: selectedInsurance,
    },
    {
      enabled: hasAccess === true && filterBy === "insurance" && !!selectedInsurance,
      staleTime: 0,
    }
  );

  const campaignReportData =
    filterBy === "insurance"
      ? campaignReportDataInsurance
      : campaignReportDataAll;
  const normalizedCampaignReportData = (campaignReportData as any) || {};
  const isLoadingReports =
    filterBy === "insurance" ? isLoadingInsuranceReports : isLoadingAllReports;

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

      let response: any;
      if (filterBy === "insurance" && selectedInsurance) {
        params.insurance = selectedInsurance;
        response = await promotionService.exportCampaignReportInsurance(params);
      } else {
        response = await promotionService.exportCampaignReport(params);
      }

      const reportData = (response?.data || []).map((promotion: any) => ({
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
    promotions: normalizedCampaignReportData?.data || [],
    insuranceOptions,
    totalItems: normalizedCampaignReportData?.total || 0,
    totalPages: normalizedCampaignReportData?.pageTotal || 1,

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
