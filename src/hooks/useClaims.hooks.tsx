import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChannelService } from "@/services/channel.services";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/context/auth.context";
import _ from "lodash";
import qs from "qs";
import ApiURL from "@/constants/api-url.const";
import { claimService } from "@/services/api.service";

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
  const defaultChannel = "40eee5bf-2b92-4d23-be55-f9caa9d3ea88";
  const { user: claimsToken } = useAuth();

  const channelService = useMemo(() => new ChannelService(), []);

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
    defaultChannel;

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
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        limit: rowsPerPage,
        channel: channelId,
      };

      if (searchData) {
        params.keyword = searchData;
      }

      const normalizedSlaStatus = searchSlaStatus?.trim().toLowerCase();
      const shouldApplySlaFilter =
        !!searchSlaStatus &&
        normalizedSlaStatus !== "all" &&
        normalizedSlaStatus !== "all priority";

      if (shouldApplySlaFilter) {
        params.sla_status = searchSlaStatus;
      }

      const status = tab === "All" ? "" : tab;
      if (status) {
        if (status !== "Draft") {
          params.status = [status];
        }
      } else {
        params.status = [
          "Submitted",
          "Acknowledged",
          "Document Review Operator",
          "Reupload Document Review Operator",
          "Lack of Documents Operator",
          "Document Review Insurance",
          "Reupload Document Review Insurance",
          "Lack of Documents Insurance",
          "Claim Assessment",
          "Approved",
          "Rejected",
          "Paid",
          "Closed",
        ];
      }

      if (date?.from) {
        params.date_from = format(date.from, "yyyy-MM-dd");
      }

      if (date?.to) {
        params.date_to = format(date.to, "yyyy-MM-dd");
      }

      const queryString = qs.stringify(params, { arrayFormat: "brackets" });
      const response = await claimService.get(
        `${ApiURL.v1Claims}?${queryString}`
      );

      return response.data;
    },
    enabled: !!channelId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { data: channelsData, isFetching: isLoadingChannels } = useQuery({
    queryKey: ["channels"],
    queryFn: () => channelService.getChannels(undefined, 100),
    staleTime: 30000,
  });

  const tokenChannel = useMemo(() => {
    if (!claimsToken) return defaultChannel;

    return (
      claimsToken.channel ||
      claimsToken.account_channels?.[0]?.channel ||
      defaultChannel
    );
  }, [claimsToken]);

  useEffect(() => {
    if (channelsData?.data) {
      setChannels(channelsData?.data);
    }
  }, [channelsData]);

  useEffect(() => {
    if (searchChannel === null && channels.length > 0) {
      const isTokenChannelValid = channels.some(
        (channel) => channel.id === tokenChannel
      );
      setSearchChannel(isTokenChannelValid ? tokenChannel : defaultChannel);
    }
  }, [searchChannel, channels, tokenChannel]);

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
    claims: resClaims?.data || [],
    filteredClaims: resClaims?.data || [],
    totalPages: resClaims?.pageTotal || 1,
    totalData: resClaims?.total || 0,
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
