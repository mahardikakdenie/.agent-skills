import React, { useState, useCallback, useEffect } from "react";
import { useUpdateTransactionStatus } from "@/services/transaction/hooks/mutations/useUpdateTransactionStatus";
import { useTransactions as useTransactionsQuery } from "@/services/transaction/hooks/queries/useTransactions";
import toast from "react-hot-toast";

interface UseTransactionsProps {
  transactions: any[];
  totalPages: number;
  totalItems: number;
  totalData: number;

  page: number;
  rowsPerPage: number;
  tab: string;
  searchData: string;
  type: string;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setTab: (tab: string) => void;
  setSearchData: (search: string) => void;
  setType: (type: string) => void;

  isLoading: boolean;
  isLoadingUpdateStatus: boolean;
  isError: boolean;
  error: any;
  isFetching: boolean;

  refetch: () => void;
  handleSearch: (keyword: string) => void;
  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectTab: (tab: string) => void;
  handleChannelChange: (v: string) => void;
  handleUpdateToPaid: (id: string) => Promise<void>;
}

export default function useTransactions(): UseTransactionsProps {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tab, setTab] = useState("All");
  const [searchData, setSearchData] = useState("");
  const [type, setType] = useState<string>("conventional");

  const [transactions, setTransactions] = useState<any[]>([]);

  const transactionParams: Record<string, any> = {
    page,
    limit: rowsPerPage,
    type: type || undefined,
    keyword: searchData || undefined,
    status: tab === "All" ? undefined : tab,
  };

  const {
    data: resTransactions,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useTransactionsQuery(transactionParams, {
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { mutate: mutateUpdateStatus, isPending: isLoadingUpdateStatus } =
    useUpdateTransactionStatus({
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        toast.error("Failed to update transaction status");
        console.error("Failed to update transaction status:", error);
      },
    });

  useEffect(() => {
    const transactionsData: any = resTransactions;
    if (transactionsData?.data) {
      let filteredData = transactionsData.data;

      setTransactions(filteredData);
    } else {
      setTransactions([]);
    }
  }, [resTransactions]);

  const handleSearch = useCallback((keyword: string) => {
    setSearchData(keyword);
    setPage(1);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const selectTab = useCallback((tabName: string) => {
    setTab(tabName);
    setPage(1);
  }, []);

  const handleChannelChange = useCallback((v: string) => {
    setType(v);
    setPage(1);
  }, []);

  const handleUpdateToPaid = useCallback(
    async (id: string) => {
      try {
        mutateUpdateStatus({
          id,
          payload: {
            payment_info: "Paid",
          },
        });
      } catch (error) {
        throw error;
      }
    },
    [mutateUpdateStatus]
  );

  useEffect(() => {
    if (searchData || type) {
      setPage(1);
    }
  }, [searchData, type]);

  return {
    transactions,
    totalPages: (resTransactions as any)?.pageTotal || 1,
    totalItems: (resTransactions as any)?.total || 0,
    totalData: (resTransactions as any)?.total || 0,

    page,
    rowsPerPage,
    tab,
    searchData,
    type,

    setPage,
    setRowsPerPage,
    setTab,
    setSearchData,
    setType,

    isLoading,
    isError,
    error,
    isFetching,
    isLoadingUpdateStatus,

    refetch,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleChannelChange,
    handleUpdateToPaid,
  };
}
