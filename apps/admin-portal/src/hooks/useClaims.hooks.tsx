import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/context/auth.context";
import { useClaims as useClaimsQuery } from "@/services/claims/hooks/queries";
import { useChannels } from "@/services/channel/hooks/queries";

interface UseClaimsProps {
  claims: any[];
  filteredClaims: any[];
  totalPages: number;
  totalData: number;
  channels: any[];

  page: number;
  rowsPerPage: number;
  tab: string;
  searchData: string;
  searchSlaStatus: string;
  date: DateRange | undefined;
  searchChannel: string | null;
  selectedChannel: any;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setTab: (tab: string) => void;
  setSearchData: (search: string) => void;
  setSearchSlaStatus: (status: string) => void;
  setDate: (date: DateRange | undefined) => void;
  setSearchChannel: (channel: string) => void;

  isLoading: boolean;
  isError: boolean;
  error: any;
  isFetching: boolean;
  isLoadingChannels: boolean;

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

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPageState] = useState(() => {
    return parseInt(searchParams.get("page") || "1", 10);
  });

  const [rowsPerPage, setRowsPerPageState] = useState(() => {
    return parseInt(searchParams.get("limit") || "10", 10);
  });

  const [channels, setChannels] = useState<any[]>([]);

  const [tab, setTabState] = useState(() => {
    return searchParams.get("status") || "All";
  });

  const [searchData, setSearchData] = useState("");

  const [searchSlaStatus, setSearchSlaStatusState] = useState(() => {
    return searchParams.get("sla_status") || "";
  });

  const [date, setDateState] = useState<DateRange | undefined>(() => {
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    if (dateFrom || dateTo) {
      return {
        from: dateFrom ? new Date(dateFrom) : undefined,
        to: dateTo ? new Date(dateTo) : undefined,
      };
    }
    return undefined;
  });

  const [searchChannel, setSearchChannelState] = useState<string | null>(() => {
    return searchParams.get("channel") || null;
  });

  const [selectedChannel, setSelectedChannel] = useState<any>({
    id: "40eee5bf-2b92-4d23-be55-f9caa9d3ea88",
    name: "Teman",
  });

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

  const setTab = useCallback(
    (newTab: string) => {
      setTabState(newTab);
      setPageState(1);
      updateURL({
        status: newTab === "All" ? undefined : newTab,
        page: 1,
      });
    },
    [updateURL]
  );

  const setSearchSlaStatus = useCallback(
    (newSlaStatus: string) => {
      setSearchSlaStatusState(newSlaStatus);
      setPageState(1);
      updateURL({
        sla_status:
          newSlaStatus === "All" || !newSlaStatus ? undefined : newSlaStatus,
        page: 1,
      });
    },
    [updateURL]
  );

  const setDate = useCallback(
    (newDate: DateRange | undefined) => {
      setDateState(newDate);
      setPageState(1);
      updateURL({
        date_from: newDate?.from
          ? format(newDate.from, "yyyy-MM-dd")
          : undefined,
        date_to: newDate?.to ? format(newDate.to, "yyyy-MM-dd") : undefined,
        page: 1,
      });
    },
    [updateURL]
  );

  const setSearchChannel = useCallback(
    (newChannel: string) => {
      setSearchChannelState(newChannel);
      const selectedChannelObj = channels.find((x) => x.id === newChannel);
      if (selectedChannelObj) {
        setSelectedChannel(selectedChannelObj);
      }
      setPageState(1);
      updateURL({
        channel: newChannel,
        page: 1,
      });
    },
    [channels, updateURL]
  );

  const channelId =
    searchChannel ||
    claimsToken?.channel ||
    claimsToken?.account_channels?.[0]?.channel ||
    defaultChannel;

  const claimParams = useMemo(() => {
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

    return params;
  }, [channelId, date?.from, date?.to, page, rowsPerPage, searchData, searchSlaStatus, tab]);

  const {
    data: resClaims,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useClaimsQuery(claimParams as any, {
    enabled: !!channelId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { data: channelsData, isFetching: isLoadingChannels } = useChannels(
    { page: 1, limit: 100 },
    { staleTime: 30000 }
  );

  const tokenChannel = useMemo(() => {
    if (!claimsToken) return defaultChannel;

    return (
      claimsToken.channel ||
      claimsToken.account_channels?.[0]?.channel ||
      defaultChannel
    );
  }, [claimsToken]);

  useEffect(() => {
    const channelsResult = (channelsData as any)?.data;
    if (channelsResult) {
      setChannels(channelsResult as any[]);
    }
  }, [channelsData]);

  useEffect(() => {
    if (searchChannel === null && channels.length > 0) {
      const isTokenChannelValid = channels.some(
        (channel) => channel.id === tokenChannel
      );
      const defaultChannelToUse = isTokenChannelValid
        ? tokenChannel
        : defaultChannel;
      setSearchChannelState(defaultChannelToUse);

      if (!searchParams.get("channel")) {
        updateURL({ channel: defaultChannelToUse });
      }
    }
  }, [searchChannel, channels, tokenChannel, searchParams, updateURL]);

  const handleSearch = useCallback((keyword: string) => {
    setSearchData(keyword);
    setPageState(1);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
    },
    [setRowsPerPage]
  );

  const selectTab = useCallback(
    (tabName: string) => {
      setTab(tabName);
    },
    [setTab]
  );

  const handleSearchSlaStatusChange = useCallback(
    (v: string) => {
      setSearchSlaStatus(v);
    },
    [setSearchSlaStatus]
  );

  const handleChannelChange = useCallback(
    (v: string) => {
      setSearchChannel(v);
    },
    [setSearchChannel]
  );

  useEffect(() => {
    if (searchData) {
      setPageState(1);
    }
  }, [searchData]);

  const handleRefetch = useCallback(() => {
    void refetch();
  }, [refetch]);

  const claimsData = (resClaims as any)?.data || [];
  const claimsTotalPages = (resClaims as any)?.pageTotal || 1;
  const claimsTotal = (resClaims as any)?.total || 0;

  return {
    claims: claimsData,
    filteredClaims: claimsData,
    totalPages: claimsTotalPages,
    totalData: claimsTotal,
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

    refetch: handleRefetch,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleSearchSlaStatusChange,
    handleChannelChange,
  };
}
