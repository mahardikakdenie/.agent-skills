import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth.context";
import _ from "lodash";
import ApiURL from "@/constants/api-url.const";
import { transactionService } from "@/services/api.service";
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
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tab, setTab] = useState("All");
  const [searchData, setSearchData] = useState("");
  const [type, setType] = useState<string>("conventional");

  const [transactions, setTransactions] = useState<any[]>([]);

  const queryKey = ["transactions", page, rowsPerPage, tab, searchData, type];

  const {
    data: resTransactions,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        limit: rowsPerPage,
        type: type || undefined,
        keyword: searchData || undefined,
        status: tab === "All" ? undefined : tab,
      };

      const response = await transactionService.get(ApiURL.v1Transactions, {
        params,
      });
      return response.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { mutate: mutateUpdateStatus, isPending: isLoadingUpdateStatus } =
    useMutation({
      mutationFn: async (id: string) => {
        const response = await transactionService.put(
          ApiURL.v1TransactionUpdateStatus(id),
          {
            payment_info: "Paid",
          }
        );
        return response.data;
      },
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        toast.error("Failed to update transaction status");
        console.error("Failed to update transaction status:", error);
      },
    });

  useEffect(() => {
    if (resTransactions?.data) {
      let filteredData = resTransactions.data;

      setTransactions(filteredData);
    } else {
      setTransactions([]);
    }
  }, [resTransactions?.data]);

  const handleSearch = useMemo(
    () =>
      _.debounce((keyword: string) => {
        setSearchData(keyword);
        setPage(1);
      }, 300),
    []
  );

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
        mutateUpdateStatus(id);
      } catch (error) {
        throw error;
      }
    },
    [refetch]
  );

  useEffect(() => {
    if (searchData || type) {
      setPage(1);
    }
  }, [searchData, type]);

  useEffect(() => {
    return () => {
      handleSearch.cancel?.();
    };
  }, [handleSearch]);

  return {
    transactions,
    totalPages: resTransactions?.pageTotal || 1,
    totalItems: resTransactions?.total || 0,
    totalData: resTransactions?.total || 0,

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
