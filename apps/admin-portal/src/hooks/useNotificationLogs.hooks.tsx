import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { reportService } from "@/services/report/api/report.service";

interface UseNotificationLogsProps {
  notificationLogs: any[];
  totalPages: number;
  totalItems: number;

  page: number;
  rowsPerPage: number;
  searchData: string;

  setPage: (page: number) => void;
  handleSearch: (keyword: string) => void;
  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: any;
  refetch: () => void;
}

export default function useNotificationLogs(): UseNotificationLogsProps {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchData, setSearchData] = useState("");

  const {
    data: resNotificationLogs,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["notification-logs", page, rowsPerPage, searchData],
    queryFn: async () => {
      const response = await reportService.getNotificationLogs({
        page,
        limit: rowsPerPage,
        // Add any additional filters as needed
        // type: "Email",
        // stage: "submission",
        // status: "sent",
      });
      return response;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const handleSearch = useMemo(
    () =>
      _.debounce((keyword: string) => {
        setSearchData(keyword);
        setPage(1);
      }, 300),
    [],
  );

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  return {
    notificationLogs: resNotificationLogs?.data || [],
    totalPages: resNotificationLogs?.pageTotal || 1,
    totalItems: resNotificationLogs?.total || 0,

    page,
    rowsPerPage,
    searchData,

    setPage,
    handleSearch,
    handleRowsPerPageChange,

    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
