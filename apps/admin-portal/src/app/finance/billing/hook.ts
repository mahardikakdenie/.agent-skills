import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { format } from "date-fns";
import { useChannelsV1 } from "@/services/channel/hooks/queries";
import {
  useBillings,
  useBillingDetail,
  useBrokerFeesFilter,
  useChannelFeesFilter,
  useNotMatchReconciliation,
} from "@/services/finance/hooks/queries";
import {
  useConfirmBillingReconciliation,
  useCreateBilling,
  useImportTransactions,
  useUpdateBilling,
} from "@/services/finance/hooks/mutations";
import { financeService } from "@/services/finance/api/finance.service";
import { useCategories, useInsurances } from "@/services/product/hooks/queries";
import { useTransactions } from "@/services/transaction/hooks/queries";
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

  const { data: channelsResponse, isLoading: isLoadingChannels } = useChannelsV1(
    { page: 1, limit: 100 },
    { staleTime: 10 * 60 * 1000 }
  );
  const channelsData = useMemo(
    () => (channelsResponse as any)?.data || [],
    [channelsResponse]
  );

  const { data: insurancesResponse, isLoading: isLoadingInsurances } =
    useInsurances({}, { staleTime: 10 * 60 * 1000 });
  const insurancesData = useMemo(
    () => (insurancesResponse as any)?.data || [],
    [insurancesResponse]
  );

  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useCategories(undefined, { staleTime: 5 * 60 * 1000 });
  const categoriesData = (categoriesResponse as any)?.data || [];

  const billingsParams = useMemo(() => {
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

    return query;
  }, [date, page, rowsPerPage, searchCategory, searchChannel, searchType]);

  const {
    data: billingsData,
    isLoading: isLoadingBillings,
    isFetching: isFetchingBillings,
    refetch: refetchBillings,
  } = useBillings(billingsParams, {
    enabled: !!searchType && !!searchChannel,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const billingDetailParams = useMemo(() => {
    const params: any = {
      page: billingDetailsParams?.page || page,
      pageSize: billingDetailsParams?.limit || rowsPerPage,
    };

    if (billingDetailsParams?.groupBy || groupBy) {
      params.groupBy = billingDetailsParams?.groupBy || groupBy;
    }

    return params;
  }, [billingDetailsParams, groupBy, page, rowsPerPage]);

  const {
    data: billingData,
    isLoading: isLoadingBilling,
    refetch: refetchBilling,
  } = useBillingDetail(billingId || "", billingDetailParams, {
    enabled: !!billingId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: unmatchedReconcillBillingsData,
    isLoading: isLoadingUnmatchedReconcillBillings,
  } = useNotMatchReconciliation(
    {
      page,
      pageSize: rowsPerPage,
    },
    { staleTime: 5 * 60 * 1000 }
  );

  const transactionQueryParams = useMemo(() => {
    if (!transactionParams) {
      return undefined;
    }

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

    return search;
  }, [transactionParams]);

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useTransactions(transactionQueryParams, {
    enabled: !!transactionParams,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const createBillingMutation = useCreateBilling({
    onSuccess: () => {
      toastNotification("Billing created successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to create billing", "error");
    },
  });

  const updateBillingMutation = useUpdateBilling({
    onSuccess: () => {
      toastNotification("Billing updated successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to update billing", "error");
    },
  });

  const importBillingTransactionsMutation = useImportTransactions({
    onSuccess: () => {
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

  const confirmReconciliationMutation = useConfirmBillingReconciliation({
    onSuccess: () => {
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
    const { data: feesResponse, isLoading, refetch } = useBrokerFeesFilter(
      insuranceId
        ? {
            insuranceId,
            productId,
            planId,
          }
        : undefined,
      {
        enabled: !!insuranceId,
        staleTime: 5 * 60 * 1000,
      }
    );

    const fees = (feesResponse as any)?.data;

    if (!insuranceId) {
      return { data: null, isLoading, refetch };
    }

    if (Array.isArray(fees) && fees.length > 0) {
      return {
        data: {
          insurance: fees[0].insurance,
          fee: fees[0].fee,
          fee_type: fees[0].fee_type,
        },
        isLoading,
        refetch,
      };
    }

    return {
      data: {
        insurance: "",
        fee: 0,
        fee_type: "",
      },
      isLoading,
      refetch,
    };
  };

  const useChannelFees = (
    channelId: string,
    insuranceId?: string,
    _productId?: string,
    _planId?: string
  ) => {
    void _productId;
    void _planId;

    const { data: feesResponse, isLoading, refetch } = useChannelFeesFilter(
      channelId && insuranceId
        ? {
            channelId,
            insuranceId,
          }
        : undefined,
      {
        enabled: !!channelId && !!insuranceId,
        staleTime: 5 * 60 * 1000,
      }
    );

    if (!channelId || !insuranceId) {
      return { data: null, isLoading, refetch };
    }

    const fees = (feesResponse as any)?.data;

    if (Array.isArray(fees) && fees.length > 0) {
      return {
        data: {
          channel: channelId,
          insurance: fees[0].insurance,
          fee: fees[0].fee,
          fee_type: fees[0].fee_type,
        },
        isLoading,
        refetch,
      };
    }

    return {
      data: {
        channel: "",
        insurance: "",
        fee: 0,
        fee_type: "",
      },
      isLoading,
      refetch,
    };
  };

  const checkDuplicateBilling = useCallback(
    async (type: string, company: string, period: string) => {
      const result = await financeService.getBillings({
        page: 1,
        pageSize: 10,
        type,
        company,
        transaction_period: period,
      });
      return result;
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

  const billingsResult = billingsData as any;
  const unmatchedReconcillBillingsResult = unmatchedReconcillBillingsData as any;
  const transactionsResult = transactionsData as any;

  return {
    billings: billingsResult?.data || [],
    billing: billingData,
    unmatchedReconcillBillings: unmatchedReconcillBillingsResult?.data || [],
    unmatchedReconcillBillingsMeta: unmatchedReconcillBillingsResult?.meta || {},
    categories: categoriesData || [],
    channels: channelsData || [],
    insurances: insurancesData || [],
    totalPages: billingsResult?.meta
      ? Math.ceil(billingsResult.meta.total / rowsPerPage)
      : 1,
    totalItems: billingsResult?.meta?.total || 0,
    totalAmount: billingsResult?.totalAmount || 0,

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

    createBilling: async (data: any) => {
      await createBillingMutation.mutateAsync(data);
    },
    updateBilling: async (id: string, data: any) => {
      await updateBillingMutation.mutateAsync({ id, payload: data });
    },
    importBillingTransactions: async (data: any) => {
      await importBillingTransactionsMutation.mutateAsync(data as FormData);
    },
    confirmReconciliation: async (id: string) => {
      await confirmReconciliationMutation.mutateAsync(id);
    },

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

    transactions: transactionsResult?.data || [],
    transactionsMeta: transactionsResult?.meta || {},
    fetchTransactions,
    fetchBillingDetails,
  };
};
