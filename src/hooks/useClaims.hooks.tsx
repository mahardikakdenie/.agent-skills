import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClaims } from "@/services/claim.service";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/context/auth.context";
import _ from "lodash";
import { getChannels } from "@/services/channel.services";

interface UseClaimsProps {
  // Data states
  claims: any[];
  filteredClaims: any[];
  totalPages: number;
  totalData: number;
  channels: any[];

  // Filter states
  page: number;
  rowsPerPage: number;
  tab: string;
  searchData: string;
  searchSlaStatus: string;
  date: DateRange | undefined;
  searchChannel: string | null;
  selectedChannel: any;

  // Filter setters/handlers
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setTab: (tab: string) => void;
  setSearchData: (search: string) => void;
  setSearchSlaStatus: (status: string) => void;
  setDate: (date: DateRange | undefined) => void;
  setSearchChannel: (channel: string) => void;

  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: any;
  isFetching: boolean;
  isLoadingChannels: boolean;

  // Methods
  refetch: () => void;
  handleSearch: (keyword: string) => void;
  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectTab: (tab: string) => void;
  handleSearchSlaStatusChange: (v: string) => void;
  handleChannelChange: (v: string) => void;
}

export default function useClaims(): UseClaimsProps {
  const { claims: claimsToken } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [channels, setChannels] = useState<any[]>([]);

  const [tab, setTab] = useState("All");
  const [searchData, setSearchData] = useState("");
  const [searchSlaStatus, setSearchSlaStatus] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [searchChannel, setSearchChannel] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<any>({
    id: "40eee5bf-2b92-4d23-be55-f9caa9d3ea88",
    name: "Teman",
  });

  const channelId =
    searchChannel ||
    claimsToken?.channel ||
    claimsToken?.account_channels?.[0]?.channel ||
    "40eee5bf-2b92-4d23-be55-f9caa9d3ea88";

  const queryKey = [
    "claims",
    page,
    rowsPerPage,
    tab,
    searchData,
    searchSlaStatus,
    date?.from?.toISOString(),
    date?.to?.toISOString(),
    channelId,
    searchChannel,
  ];

  const {
    data: resClaims,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: () =>
      getClaims(
        page,
        rowsPerPage,
        tab === "All" ? "" : tab,
        searchData,
        searchSlaStatus === "All" ? "" : searchSlaStatus,
        date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
        date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
        channelId
      ),
    enabled: !!channelId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { data: channelsData, isFetching: isLoadingChannels } = useQuery({
    queryKey: ["channels"],
    queryFn: () => getChannels(undefined, 100),
    staleTime: 30000,
  });

  useEffect(() => {
    if (channelsData?.data) {
      setChannels(channelsData?.data?.data);
    }
  }, [channelsData]);

  useEffect(() => {
    if (claimsToken && searchChannel === null) {
      const tokenChannel =
        claimsToken?.channel ||
        claimsToken?.account_channels?.[0]?.channel ||
        "40eee5bf-2b92-4d23-be55-f9caa9d3ea88";

      setSearchChannel(tokenChannel);
    }
  }, [claimsToken, searchChannel]);

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

  const handleSearchSlaStatusChange = useCallback((v: string) => {
    setSearchSlaStatus(v);
    setPage(1);
  }, []);

  const handleChannelChange = useCallback(
    (v: string) => {
      setSearchChannel(v);
      const selectedChannelObj = channels.find((x) => x.id === v);
      if (selectedChannelObj) {
        setSelectedChannel(selectedChannelObj);
      }
      setPage(1);
    },
    [channels]
  );

  useEffect(() => {
    if (searchData || searchSlaStatus || date || searchChannel) {
      setPage(1);
    }
  }, [searchData, searchSlaStatus, date, searchChannel]);

  useEffect(() => {
    return () => {
      handleSearch.cancel?.();
    };
  }, [handleSearch]);

  return {
    claims: resClaims?.data.data || [],
    filteredClaims: resClaims?.data.data || [],
    totalPages: resClaims?.data?.pageTotal || 1,
    totalData: resClaims?.data?.total || 0,
    channels,

    page,
    rowsPerPage,
    tab,
    searchData,
    searchSlaStatus,
    date,
    searchChannel,
    selectedChannel,

    setPage,
    setRowsPerPage,
    setTab,
    setSearchData,
    setSearchSlaStatus,
    setDate,
    setSearchChannel,

    isLoading,
    isError,
    error,
    isFetching,
    isLoadingChannels,

    // Methods
    refetch,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleSearchSlaStatusChange,
    handleChannelChange,
  };
}
