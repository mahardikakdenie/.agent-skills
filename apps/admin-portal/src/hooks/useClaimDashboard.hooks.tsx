import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { productService } from "@/services/product/api/product.service";
import { claimsService } from "@/services/claims/api/claims.service";
import { formatDateTimeWithTZ, formatMoney } from "@/lib/formatter";

interface UseClaimDashboardProps {
  claimStatisticData: any[];
  insuranceOptions: any[];
  productOptions: any[];
  planOptions: any[];

  pieChartData: { name: string; value: number }[];
  lineChartData: { date: string; count: number; total_claim_amount: number }[];
  barChartData: { status: string; count: number }[];
  tableData: any[];

  totalClaimAmount: number;
  totalClaimAmountApproved: number;
  totalClaim: number;
  totalClaimApproved: number;

  selectedInsuranceId: string;
  selectedProduct: string;
  selectedPlan: string;
  dateRange: DateRange | undefined;

  setSelectedInsuranceId: (id: string) => void;
  setSelectedProduct: (id: string) => void;
  setSelectedPlan: (id: string) => void;
  setDateRange: (range: DateRange | undefined) => void;

  isLoadingStatistics: boolean;
  isLoadingInsurances: boolean;
  isLoadingProducts: boolean;
  isLoadingPlans: boolean;
  isError: boolean;
  error: any;

  refetchStatistics: () => void;
}

export default function useClaimDashboard(): UseClaimDashboardProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = new Date();

  const [selectedInsuranceId, setSelectedInsuranceIdState] = useState<string>(
    () => {
      return searchParams.get("insurance") || "All";
    }
  );

  const [selectedProduct, setSelectedProductState] = useState<string>(() => {
    return searchParams.get("product") || "All";
  });

  const [selectedPlan, setSelectedPlanState] = useState<string>(() => {
    return searchParams.get("plan") || "All";
  });

  const [dateRange, setDateRangeState] = useState<DateRange | undefined>(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (from || to) {
      return {
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
      };
    }
    return {
      from: today,
      to: today,
    };
  });

  const updateURL = useCallback(
    (params: Record<string, string | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "All"
        ) {
          current.set(key, String(value));
        } else {
          current.delete(key);
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setSelectedInsuranceId = useCallback(
    (id: string) => {
      setSelectedInsuranceIdState(id);
      setSelectedProductState("All");
      setSelectedPlanState("All");
      updateURL({
        insurance: id,
        product: undefined,
        plan: undefined,
      });
    },
    [updateURL]
  );

  const setSelectedProduct = useCallback(
    (id: string) => {
      setSelectedProductState(id);
      setSelectedPlanState("All");
      updateURL({
        product: id,
        plan: undefined,
      });
    },
    [updateURL]
  );

  const setSelectedPlan = useCallback(
    (id: string) => {
      setSelectedPlanState(id);
      updateURL({
        plan: id,
      });
    },
    [updateURL]
  );

  const setDateRange = useCallback(
    (range: DateRange | undefined) => {
      setDateRangeState(range);
      updateURL({
        from: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
        to: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
      });
    },
    [updateURL]
  );

  const { data: insurancesData, isFetching: isLoadingInsurances } = useQuery({
    queryKey: ["insurances"],
    queryFn: async () => {
      const response: any = await productService.getInsurances();
      return response?.data || [];
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const insuranceOptions = useMemo(() => {
    if (!insurancesData) return [{ label: "INSURANCE NAME", value: "All" }];

    const list = insurancesData.map((ins: { name: string; id: string }) => ({
      label: ins.name,
      value: ins.id,
    }));
    return [{ label: "INSURANCE NAME", value: "All" }, ...list];
  }, [insurancesData]);

  const { data: productsData, isFetching: isLoadingProducts } = useQuery({
    queryKey: ["products", selectedInsuranceId],
    queryFn: async () => {
      const response: any = await productService.getProducts({
        insuranceIds:
          selectedInsuranceId !== "All" && selectedInsuranceId
            ? [selectedInsuranceId]
            : [],
        page: 1,
        pageSize: 100,
      });
      return response?.data || [];
    },
    enabled: !!selectedInsuranceId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const productOptions = useMemo(() => {
    if (!productsData) return [{ label: "INSURANCE PRODUCT", value: "All" }];

    const list = productsData.map((prod: { name: string; id: string }) => ({
      label: prod.name,
      value: prod.id,
    }));
    return [{ label: "INSURANCE PRODUCT", value: "All" }, ...list];
  }, [productsData]);

  const { data: plansData, isFetching: isLoadingPlans } = useQuery({
    queryKey: ["plans", selectedProduct],
    queryFn: async () => {
      const response: any = await productService.getPlans({
        productIds:
          selectedProduct !== "All" && selectedProduct
            ? [selectedProduct]
            : [],
        page: 1,
        pageSize: 100,
      });
      return response?.data || [];
    },
    enabled: !!selectedProduct && selectedProduct !== "All",
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const planOptions = useMemo(() => {
    if (!plansData) return [{ label: "PLAN NAME", value: "All" }];

    const list = plansData.map((plan: { name: string; id: string }) => ({
      label: plan.name,
      value: plan.id,
    }));
    return [{ label: "PLAN NAME", value: "All" }, ...list];
  }, [plansData]);

  const {
    data: statisticsData,
    isLoading: isLoadingStatistics,
    isError,
    error,
    refetch: refetchStatistics,
  } = useQuery({
    queryKey: [
      "claimStatistics",
      selectedInsuranceId,
      selectedProduct,
      selectedPlan,
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
    ],
    queryFn: async () => {
      const params = {
        sort: "desc",
        insurance:
          selectedInsuranceId && selectedInsuranceId !== "All"
            ? selectedInsuranceId
            : undefined,
        product:
          selectedProduct && selectedProduct !== "All"
            ? selectedProduct
            : undefined,
        plan: selectedPlan && selectedPlan !== "All" ? selectedPlan : undefined,
        from: dateRange?.from
          ? format(dateRange.from, "yyyy-MM-dd")
          : format(today, "yyyy-MM-dd"),
        to: dateRange?.to
          ? format(dateRange.to, "yyyy-MM-dd")
          : format(today, "yyyy-MM-dd"),
      };

      const response: any = await claimsService.getClaimStatistics(params);

      return {
        data: response?.data || [],
        totalClaimAmount: response?.total_claim_amount || 0,
        totalClaimAmountApproved: response?.total_claim_amount_approved || 0,
        totalClaim: response?.total_claim || 0,
        totalClaimApproved: response?.total_claim_approved || 0,
      };
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const pieChartData = useMemo(() => {
    if (!Array.isArray(statisticsData?.data)) return [];

    const groupedData: Record<string, { name: string; value: number }> =
      statisticsData.data.reduce((acc, item) => {
        if (item?.type) {
          if (!acc[item.type]) {
            acc[item.type] = { name: item.type, value: 0 };
          }
          acc[item.type].value += 1;
        }
        return acc;
      }, {} as Record<string, { name: string; value: number }>);

    return Object.values(groupedData);
  }, [statisticsData?.data]);

  const lineChartData = useMemo(() => {
    if (!Array.isArray(statisticsData?.data)) return [];

    return statisticsData.data
      .map((item) => ({
        date: format(new Date(item.created_at), "yyyy-MM-dd"),
        amount: item.amount || 0,
        amount_approved: item.amount_approved || 0,
      }))
      .reduce(
        (
          acc: { date: string; count: number; total_claim_amount: number }[],
          record
        ) => {
          const existing = acc.find((item) => item.date === record.date);
          if (existing) {
            existing.count += 1;
            existing.total_claim_amount += record.amount;
          } else {
            acc.push({
              date: record.date,
              count: 1,
              total_claim_amount: record.amount,
            });
          }
          return acc;
        },
        []
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [statisticsData?.data]);

  const barChartData = useMemo(() => {
    if (!Array.isArray(statisticsData?.data)) return [];

    return Object.values(
      statisticsData.data.reduce((acc, claim) => {
        if (!acc[claim.status]) {
          acc[claim.status] = { status: claim.status, count: 0 };
        }
        acc[claim.status].count += 1;
        return acc;
      }, {} as Record<string, { status: string; count: number }>)
    ) as { status: string; count: number }[];
  }, [statisticsData?.data]);

  const tableData = useMemo(() => {
    if (!Array.isArray(statisticsData?.data)) return [];

    return statisticsData.data.map((item) => ({
      created_at: formatDateTimeWithTZ(item.created_at),
      number: item.number,
      type: item.type,
      amount: `${formatMoney(item.amount)}`,
      amount_approved: `${formatMoney(item.amount_approved)}`,
      status: item.status,
    }));
  }, [statisticsData?.data]);

  return {
    claimStatisticData: statisticsData?.data || [],
    insuranceOptions,
    productOptions,
    planOptions,

    pieChartData,
    lineChartData,
    barChartData,
    tableData,

    totalClaimAmount: statisticsData?.totalClaimAmount || 0,
    totalClaimAmountApproved: statisticsData?.totalClaimAmountApproved || 0,
    totalClaim: statisticsData?.totalClaim || 0,
    totalClaimApproved: statisticsData?.totalClaimApproved || 0,

    selectedInsuranceId,
    selectedProduct,
    selectedPlan,
    dateRange,

    setSelectedInsuranceId,
    setSelectedProduct,
    setSelectedPlan,
    setDateRange,

    isLoadingStatistics,
    isLoadingInsurances,
    isLoadingProducts,
    isLoadingPlans,
    isError,
    error,

    refetchStatistics,
  };
}
