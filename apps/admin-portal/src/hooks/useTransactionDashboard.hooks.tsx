import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import ApiURL from "@/constants/api-url.const";
import { productService, transactionService } from "@/services/api.service";
import { formatDateTimeWithTZ, formatMoney } from "@/lib/formatter";

interface UseTransactionDashboardProps {
  transactionStatisticData: any[];
  insuranceOptions: any[];
  productOptions: any[];
  planOptions: any[];

  pieChartData: { name: string; value: number }[];
  lineChartData: { date: string; count: number }[];
  barChartData: { status: string; count: number }[];
  tableData: any[];

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

export default function useTransactionDashboard(): UseTransactionDashboardProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

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
      from: thirtyDaysAgo,
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
      const response = await productService.get(ApiURL.v1Insurances);
      return response?.data?.data || [];
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
      const response = await productService.get(ApiURL.v1Products, {
        params: {
          insuranceIds:
            selectedInsuranceId !== "All" && selectedInsuranceId
              ? [selectedInsuranceId]
              : [],
          page: 1,
          pageSize: 100,
        },
      });
      return response?.data?.data || [];
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
      const response = await productService.get(ApiURL.v1Plans, {
        params: {
          productIds:
            selectedProduct !== "All" && selectedProduct
              ? [selectedProduct]
              : [],
          page: 1,
          pageSize: 100,
        },
      });
      return response?.data?.data || [];
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
      "transactionStatistics",
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
          : format(thirtyDaysAgo, "yyyy-MM-dd"),
        to: dateRange?.to
          ? format(dateRange.to, "yyyy-MM-dd")
          : format(today, "yyyy-MM-dd"),
      };

      const response: any = await transactionService.get(
        ApiURL.v1TransactionsStatisticData,
        { params }
      );

      return response?.data?.data || [];
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const pieChartData = useMemo(() => {
    if (!Array.isArray(statisticsData)) return [];

    const groupedData = statisticsData
      .map((item: any) => item.transaction_packages || [])
      .reduce((acc, curr) => acc.concat(curr), [])
      .map((product: any) => product.package_data.plan)
      .filter((plan: any) => plan?.name)
      .reduce(
        (acc: Record<string, { name: string; value: number }>, item: any) => {
          if (!acc[item.name]) {
            acc[item.name] = { name: item.name, value: 0 };
          }
          acc[item.name].value += 1;
          return acc;
        },
        {}
      );

    return Object.values(groupedData) as { name: string; value: number }[];
  }, [statisticsData]);

  const lineChartData = useMemo(() => {
    if (!Array.isArray(statisticsData)) return [];

    return statisticsData
      .map((item) => ({
        date: format(new Date(item.created_at), "yyyy-MM-dd"),
      }))
      .reduce((acc: { date: string; count: number }[], record) => {
        const existing = acc.find((item) => item.date === record.date);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ date: record.date, count: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [statisticsData]);

  const barChartData = useMemo(() => {
    if (!Array.isArray(statisticsData)) return [];

    const grouped = statisticsData.reduce((acc, policy) => {
      const formattedDate = format(new Date(policy.created_at), "yyyy-MM-dd");
      const price = parseFloat(policy.transaction_packages?.[0]?.price) || 0;

      if (!acc[formattedDate]) {
        acc[formattedDate] = { status: formattedDate, count: 0 };
      }
      acc[formattedDate].count += price;
      return acc;
    }, {} as Record<string, { status: string; count: number }>);

    return Object.values(grouped) as { status: string; count: number }[];
  }, [statisticsData]);

  const tableData = useMemo(() => {
    if (!Array.isArray(statisticsData)) return [];

    return statisticsData.map((item) => ({
      created_at: formatDateTimeWithTZ(item.created_at),
      plan_name: item.transaction_packages?.[0]?.package_data?.plan?.name,
      price: `${item.transaction_packages?.[0]?.currency} ${formatMoney(
        item.transaction_packages?.[0]?.price
      )}`,
      transaction: item.transaction_packages?.[0]?.quantity,
    }));
  }, [statisticsData]);

  return {
    transactionStatisticData: statisticsData || [],
    insuranceOptions,
    productOptions,
    planOptions,

    pieChartData,
    lineChartData,
    barChartData,
    tableData,

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
