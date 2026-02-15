import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { policyService } from "@/services/policy/api/policy.service";

interface UseEndorsementsProps {
  endorsements: any[];
  totalPages: number;
  totalItems: number;
  totalData: number;

  page: number;
  rowsPerPage: number;
  tab: string;
  searchData: string;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setTab: (tab: string) => void;
  setSearchData: (search: string) => void;

  isLoading: boolean;
  isError: boolean;
  error: any;
  isFetching: boolean;

  refetch: () => void;
  handleSearch: (keyword: string) => void;
  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectTab: (tab: string) => void;
}

export default function useEndorsements(): UseEndorsementsProps {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tab, setTab] = useState("All");
  const [searchData, setSearchData] = useState("");

  const [endorsements, setEndorsements] = useState<any[]>([]);

  const queryKey = ["endorsements", page, rowsPerPage, tab, searchData];

  const {
    data: resEndorsements,
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
        keyword: searchData || undefined,
        status: tab && tab !== "All" ? tab : undefined,
      };

      const response = await policyService.getEndorsements(params);
      return response;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  useEffect(() => {
    const endorsementsData: any = resEndorsements;
    if (endorsementsData?.data) {
      setEndorsements(endorsementsData.data);
    } else {
      setEndorsements([]);
    }
  }, [resEndorsements]);

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

  useEffect(() => {
    if (searchData) {
      setPage(1);
    }
  }, [searchData]);

  useEffect(() => {
    return () => {
      handleSearch.cancel?.();
    };
  }, [handleSearch]);

  return {
    endorsements,
    totalPages: (resEndorsements as any)?.pageTotal || 1,
    totalItems: (resEndorsements as any)?.total || 0,
    totalData: (resEndorsements as any)?.total || 0,

    page,
    rowsPerPage,
    tab,
    searchData,

    setPage,
    setRowsPerPage,
    setTab,
    setSearchData,

    isLoading,
    isError,
    error,
    isFetching,

    refetch,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
  };
}
