import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { format } from "date-fns";
import {
  channelService,
  financeService,
  financeServiceFormData,
  productService,
  transactionService,
} from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import { toastNotification } from "@/lib/toast";

interface UseBillingProps {
  billings: any[];
  billing: any;
  unmatchedReconcillBillings: any[];
  unmatchedReconcillBillingsMeta: any;
  categories: any[];
  channels: any[];
  insurances: any[];
  totalPages: number;
  totalItems: number;
  totalAmount: number;

  page: number;
  rowsPerPage: number;
  searchType: string;
  searchChannel: string;
  searchCategory: string;
  date: Date | null;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setSearchType: (type: string) => void;
  setSearchChannel: (channel: string) => void;
  setSearchCategory: (category: string) => void;
  setDate: (date: Date | null) => void;

  isLoadingBillings: boolean;
  isLoadingBilling: boolean;
  isLoadingCategories: boolean;
  isLoadingChannels: boolean;
  isLoadingInsurances: boolean;
  isLoadingUnmatchedReconcillBillings: boolean;
  isFetchingBillings: boolean;

  createBilling: (data: any) => Promise<void>;
  updateBilling: (id: string, data: any) => Promise<void>;
  importBillingTransactions: (data: any) => Promise<void>;
  confirmReconciliation: (id: string) => Promise<void>;

  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleTypeChange: (type: string) => void;
  handleChannelChange: (channel: string) => void;
  handleCategoryChange: (category: string) => void;
  handleDateChange: (date: Date | null) => void;

  useFees: (
    insuranceId: string,
    productId?: string,
    planId?: string
  ) => {
    data: any;
    isLoading: boolean;
    refetch: () => void;
  };
  useChannelFees: (
    channelId: string,
    insuranceId?: string,
    productId?: string,
    planId?: string
  ) => {
    data: any;
    isLoading: boolean;
    refetch: () => void;
  };
  checkDuplicateBilling: (
    type: string,
    company: string,
    period: string
  ) => Promise<any>;

  refetchBillings: () => void;
  refetchBilling: () => void;

  transactions: any[];
  transactionsMeta: any;
  isLoadingTransactions: boolean;

  fetchTransactions: (params: {
    type: string;
    company: string;
    category: string;
    from: string;
    to: string;
    page: number;
    limit: number;
  }) => Promise<void>;

  fetchBillingDetails: (
    id: string,
    params?: {
      page?: number;
      limit?: number;
      groupBy?: string;
    }
  ) => Promise<void>;
}

interface UseBillingHookProps {
  billingId?: string;
  groupBy?: string;
}

export const useBilling = (props?: UseBillingHookProps): UseBillingProps => {
  const { billingId, groupBy } = props || {};
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultChannel = "40eee5bf-2b92-4d23-be55-f9caa9d3ea88";

  const [page, setPageState] = useState(() => {
    return parseInt(searchParams.get("page") || "1", 10);
  });

  const [rowsPerPage, setRowsPerPageState] = useState(() => {
    return parseInt(searchParams.get("limit") || "10", 10);
  });

  const [searchType, setSearchTypeState] = useState(() => {
    return searchParams.get("type") || "partner";
  });

  const [searchChannel, setSearchChannelState] = useState(() => {
    return searchParams.get("channel") || defaultChannel;
  });

  const [searchCategory, setSearchCategoryState] = useState(() => {
    return searchParams.get("category") || "All";
  });

  const [date, setDateState] = useState<Date | null>(() => {
    const dateParam = searchParams.get("date");
    return dateParam ? new Date(dateParam) : null;
  });

  const [transactionParams, setTransactionParams] = useState<any>(null);

  const [billingDetailsParams, setBillingDetailsParams] = useState<any>(null);

  const updateURL = useCallback(
    (params: Record<string, string | number | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
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

  const setPage = useCallback(
    (newPage: number) => {
      setPageState(newPage);
      updateURL({ page: newPage });
    },
    [updateURL]
  );

  const setRowsPerPage = useCallback(
    (newRowsPerPage: number) => {
      setRowsPerPageState(newRowsPerPage);
      setPageState(1);
      updateURL({ limit: newRowsPerPage, page: 1 });
    },
    [updateURL]
  );

  const setSearchType = useCallback(
    (newType: string) => {
      setSearchTypeState(newType);
      setPageState(1);
      updateURL({ type: newType, page: 1 });
    },
    [updateURL]
  );

  const setSearchChannel = useCallback(
    (newChannel: string) => {
      setSearchChannelState(newChannel);
      setPageState(1);
      updateURL({ channel: newChannel, page: 1 });
    },
    [updateURL]
  );

  const setSearchCategory = useCallback(
    (newCategory: string) => {
      setSearchCategoryState(newCategory);
      setPageState(1);
      updateURL({
        category: newCategory === "All" ? undefined : newCategory,
        page: 1,
      });
    },
    [updateURL]
  );

  const setDate = useCallback(
    (newDate: Date | null) => {
      setDateState(newDate);
      setPageState(1);
      updateURL({
        date: newDate ? format(newDate, "yyyy-MM") : undefined,
        page: 1,
      });
    },
    [updateURL]
  );

  const { data: channelsData, isLoading: isLoadingChannels } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const response = await channelService.get(ApiURL.v1Channels, {
        params: { page: 1, limit: 100 },
      });
      return response?.data?.data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: insurancesData, isLoading: isLoadingInsurances } = useQuery({
    queryKey: ["insurances"],
    queryFn: async () => {
      const response = await productService.get(ApiURL.v1Insurances, {
        params: {},
      });
      return response?.data?.data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await productService.get(ApiURL.v1Categories);
      return response?.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const queryKey = useMemo(
    () => [
      "billings",
      page,
      rowsPerPage,
      searchType,
      searchChannel,
      searchCategory,
      date?.toISOString(),
    ],
    [page, rowsPerPage, searchType, searchChannel, searchCategory, date]
  );

  const {
    data: billingsData,
    isLoading: isLoadingBillings,
    isFetching: isFetchingBillings,
    refetch: refetchBillings,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const query: { [key: string]: any } = {
        type: searchType,
        company: searchChannel,
        page,
        pageSize: rowsPerPage,
      };

      if (date) {
        const startDate = format(
          new Date(date.getFullYear(), date.getMonth(), 1),
          "yyyy-MM-dd"
        );
        const endDate = format(
          new Date(date.getFullYear(), date.getMonth() + 1, 0),
          "yyyy-MM-dd"
        );
        query.startDate = startDate;
        query.endDate = endDate;
      }

      if (searchCategory !== "All") {
        query.category = searchCategory;
      }

      const response = await financeService.get(ApiURL.v1Billings, {
        params: query,
      });

      return response?.data;
    },
    enabled: !!searchType && !!searchChannel,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const {
    data: billingData,
    isLoading: isLoadingBilling,
    refetch: refetchBilling,
  } = useQuery({
    queryKey: ["billing", billingId, billingDetailsParams],
    queryFn: async () => {
      if (!billingId) return null;

      const params: any = {
        page: billingDetailsParams?.page || page,
        pageSize: billingDetailsParams?.limit || rowsPerPage,
      };

      if (billingDetailsParams?.groupBy) {
        params.groupBy = billingDetailsParams.groupBy;
      }

      const response = await financeService.get(
        ApiURL.v1BillingDetails(billingId),
        { params }
      );
      return response?.data;
    },
    enabled: !!billingId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: unmatchedReconcillBillingsData,
    isLoading: isLoadingUnmatchedReconcillBillings,
    refetch: refetchUnmatchedReconcillBillings,
  } = useQuery({
    queryKey: ["unmatched-reconcill-billings", page, rowsPerPage],
    queryFn: async () => {
      const response = await financeService.get(
        ApiURL.v1BillingsNotMatchReconciliation,
        { params: { page, pageSize: rowsPerPage } }
      );
      return response?.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["billing-transactions", transactionParams],
    queryFn: async () => {
      if (!transactionParams) return { data: [], meta: {} };

      const { type, company, category, from, to, page, limit } =
        transactionParams;

      const search: any = {
        status: "Declaration",
        page,
        limit,
        from,
        to,
      };

      if (type === "insurer") {
        search.insurance = company;
      } else if (type === "partner") {
        search.channel = company;
      }

      if (category !== "All") {
        search.category = category;
      }

      const response = await transactionService.get(ApiURL.v1Transactions, {
        params: search,
      });

      return response?.data || { data: [], meta: {} };
    },
    enabled: !!transactionParams,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const createBillingMutation = useMutation({
    mutationFn: async (data: any) => {
      await financeService.post(ApiURL.v1Billings, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billings"] });
      toastNotification("Billing created successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to create billing", "error");
    },
  });

  const updateBillingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await financeService.put(ApiURL.v1BillingDetails(id), data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["billings"] });
      queryClient.invalidateQueries({ queryKey: ["billing", variables.id] });
      toastNotification("Billing updated successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to update billing", "error");
    },
  });

  const importBillingTransactionsMutation = useMutation({
    mutationFn: async (data: any) => {
      await financeServiceFormData.post(
        ApiURL.v1BillingsImportTransaction,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billings"] });
      toastNotification(
        "Billing transactions imported successfully",
        "success"
      );
    },
    onError: (error: any) => {
      toastNotification(
        error?.message || "Failed to import billing transactions",
        "error"
      );
    },
  });

  const confirmReconciliationMutation = useMutation({
    mutationFn: async (id: string) => {
      await financeService.post(
        ApiURL.v1BillingDetailsConfirmReconciliation(id)
      );
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["billings"] });
      queryClient.invalidateQueries({ queryKey: ["billing", id] });
      toastNotification("Reconciliation confirmed successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(
        error?.message || "Failed to confirm reconciliation",
        "error"
      );
    },
  });

  const useFees = (
    insuranceId: string,
    productId?: string,
    planId?: string
  ) => {
    const { data, isLoading, refetch } = useQuery({
      queryKey: ["broker-fees", insuranceId, productId, planId],
      queryFn: async () => {
        if (!insuranceId) return null;

        const response: any = await financeService.get(
          ApiURL.v1FeesBrokerFilter,
          { params: { insuranceId, productId, planId } }
        );
        const feesResponse: any = response?.data;

        if (feesResponse && feesResponse.data.length > 0) {
          return {
            insurance: feesResponse.data[0].insurance,
            fee: feesResponse.data[0].fee,
            fee_type: feesResponse.data[0].fee_type,
          };
        }

        return {
          insurance: "",
          fee: 0,
          fee_type: "",
        };
      },
      enabled: !!insuranceId,
      staleTime: 5 * 60 * 1000,
    });

    return { data, isLoading, refetch };
  };

  const useChannelFees = (
    channelId: string,
    insuranceId?: string,
    productId?: string,
    planId?: string
  ) => {
    const { data, isLoading, refetch } = useQuery({
      queryKey: ["channel-fees", channelId, insuranceId, productId, planId],
      queryFn: async () => {
        if (!channelId || !insuranceId) return null;

        const response: any = await financeService.get(
          ApiURL.v1FeesChannelFilter,
          { params: { channelId, insuranceId } }
        );
        const feesResponse: any = response?.data;

        if (feesResponse && feesResponse.data.length > 0) {
          return {
            channel: channelId,
            insurance: feesResponse.data[0].insurance,
            fee: feesResponse.data[0].fee,
            fee_type: feesResponse.data[0].fee_type,
          };
        }

        return {
          channel: "",
          insurance: "",
          fee: 0,
          fee_type: "",
        };
      },
      enabled: !!channelId && !!insuranceId,
      staleTime: 5 * 60 * 1000,
    });

    return { data, isLoading, refetch };
  };

  const checkDuplicateBilling = useCallback(
    async (type: string, company: string, period: string) => {
      const result = await financeService.get(ApiURL.v1Billings, {
        params: {
          page: 1,
          pageSize: 10,
          type,
          company,
          transaction_period: period,
        },
      });
      return result?.data;
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
    },
    [setRowsPerPage]
  );

  const handleTypeChange = useCallback(
    (type: string) => {
      setSearchType(type);

      if (type === "insurer" && insurancesData && insurancesData.length > 0) {
        setSearchChannel(insurancesData[0].id);
      } else if (
        type === "partner" &&
        channelsData &&
        channelsData.length > 0
      ) {
        setSearchChannel(channelsData[0].id);
      }

      setSearchCategory("All");
    },
    [
      setSearchType,
      setSearchChannel,
      setSearchCategory,
      insurancesData,
      channelsData,
    ]
  );

  const handleChannelChange = useCallback(
    (channel: string) => {
      setSearchChannel(channel);
      setSearchCategory("All");
    },
    [setSearchChannel, setSearchCategory]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      setSearchCategory(category);
    },
    [setSearchCategory]
  );

  const handleDateChange = useCallback(
    (newDate: Date | null) => {
      setDate(newDate);
    },
    [setDate]
  );

  const fetchTransactions = useCallback(
    async (params: {
      type: string;
      company: string;
      category: string;
      from: string;
      to: string;
      page: number;
      limit: number;
    }) => {
      setTransactionParams(params);
      await refetchTransactions();
    },
    [refetchTransactions]
  );

  const fetchBillingDetails = useCallback(
    async (
      id: string,
      params?: {
        page?: number;
        limit?: number;
        groupBy?: string;
      }
    ) => {
      setBillingDetailsParams(params);
      await refetchBilling();
    },
    [refetchBilling]
  );

  return {
    billings: billingsData?.data || [],
    billing: billingData,
    unmatchedReconcillBillings: unmatchedReconcillBillingsData?.data || [],
    unmatchedReconcillBillingsMeta: unmatchedReconcillBillingsData?.meta || {},
    categories: categoriesData || [],
    channels: channelsData || [],
    insurances: insurancesData || [],
    totalPages: billingsData?.meta
      ? Math.ceil(billingsData.meta.total / rowsPerPage)
      : 1,
    totalItems: billingsData?.meta?.total || 0,
    totalAmount: billingsData?.totalAmount || 0,

    page,
    rowsPerPage,
    searchType,
    searchChannel,
    searchCategory,
    date,

    setPage,
    setRowsPerPage,
    setSearchType,
    setSearchChannel,
    setSearchCategory,
    setDate,

    isLoadingBillings,
    isLoadingBilling,
    isLoadingCategories,
    isLoadingChannels,
    isLoadingInsurances,
    isLoadingUnmatchedReconcillBillings,
    isFetchingBillings,
    isLoadingTransactions,

    createBilling: createBillingMutation.mutateAsync,
    updateBilling: async (id: string, data: any) =>
      updateBillingMutation.mutateAsync({ id, data }),
    importBillingTransactions: importBillingTransactionsMutation.mutateAsync,
    confirmReconciliation: confirmReconciliationMutation.mutateAsync,

    handleRowsPerPageChange,
    handleTypeChange,
    handleChannelChange,
    handleCategoryChange,
    handleDateChange,

    useFees,
    useChannelFees,
    checkDuplicateBilling,

    refetchBillings,
    refetchBilling,

    transactions: transactionsData?.data || [],
    transactionsMeta: transactionsData?.meta || {},
    fetchTransactions,
    fetchBillingDetails,
  };
};
