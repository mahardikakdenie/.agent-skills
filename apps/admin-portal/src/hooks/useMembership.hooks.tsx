import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import _ from "lodash";
import AppURL from "@/constants/app-url.const";
import { useChannelsV1 } from "@/services/channel/hooks/queries/useChannelsV1";
import { useInsuredParties } from "@/services/policy/hooks/queries/useInsuredParties";

interface UseMembershipProps {
  membership: any[];
  filteredMembership: any[];
  totalPages: number;
  totalData: number;
  totalItems: number;
  channels: any[];

  page: number;
  rowsPerPage: number;
  tab: string;
  searchData: string;
  channel: string;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setTab: (tab: string) => void;
  setSearchData: (search: string) => void;
  setChannel: (channel: string) => void;

  isLoading: boolean;
  isError: boolean;
  error: any;
  isFetching: boolean;
  isLoadingChannels: boolean;

  refetch: () => void;
  handleSearch: (keyword: string) => void;
  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectTab: (tab: string) => void;
  handleChannelChange: (channelId: string) => void;
  handleExport: () => void;
  handleUpload: () => void;
  goToDetail: (id: string) => void;
  getStatusColor: (status: string) => string;
}

export function useMembership(): UseMembershipProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPageState] = useState(() => {
    return parseInt(searchParams.get("page") || "1", 10);
  });

  const [rowsPerPage, setRowsPerPageState] = useState(() => {
    return parseInt(searchParams.get("limit") || "10", 10);
  });

  const [tab, setTabState] = useState(() => {
    return searchParams.get("status") || "All";
  });

  const [channel, setChannelState] = useState(() => {
    return searchParams.get("channel") || "";
  });

  const [searchData, setSearchData] = useState("");

  const [channels, setChannels] = useState<any[]>([]);

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

  const setChannel = useCallback(
    (newChannel: string) => {
      setChannelState(newChannel);
      setPageState(1);
      updateURL({
        channel: newChannel || undefined,
        page: 1,
      });
    },
    [updateURL]
  );

  const {
    data: membershipResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useInsuredParties(
    {
      page,
      limit: rowsPerPage,
      keyword: searchData || undefined,
      status: tab !== "All" ? tab : undefined,
      channel: channel || undefined,
    },
    {
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  const { data: channelsData, isFetching: isLoadingChannels } = useChannelsV1(
    {
      page: 1,
      limit: 100,
    },
    {
      staleTime: 30000,
    }
  );

  useEffect(() => {
    const channelsResponse: any = channelsData;
    if (channelsResponse?.data) {
      setChannels(channelsResponse.data);
    }
  }, [channelsData]);

  useEffect(() => {
    if (channel || searchData) {
      setPageState(1);
    }
  }, [channel, searchData]);

  const handleSearch = useMemo(
    () =>
      _.debounce((keyword: string) => {
        setSearchData(keyword);
        setPageState(1);
      }, 300),
    []
  );

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

  const handleChannelChange = useCallback(
    (channelId: string) => {
      setChannel(channelId);
    },
    [setChannel]
  );

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Pending":
        return "text-[#CC9B36]";
      case "Active":
        return "text-[#00AB4F]";
      case "Inactive":
        return "text-[#939597]";
      default:
        return "text-[#CC9B36]";
    }
  }, []);

  const handleExport = useCallback(() => {
    const exportData = {
      page,
      limit: rowsPerPage,
      status: tab === "All" ? "" : tab,
      channel: channel,
    };
    localStorage.setItem("exportMembershipData", JSON.stringify(exportData));
    router.push(`${AppURL.membershipList}/export`);
  }, [page, rowsPerPage, tab, channel, router]);

  const handleUpload = useCallback(() => {
    router.push(`${AppURL.membershipList}/upload`);
  }, [router]);

  const goToDetail = useCallback(
    (id: string) => {
      router.push(`${AppURL.membershipDetail}/${id}`);
    },
    [router]
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel?.();
    };
  }, [handleSearch]);

  return {
    membership: (membershipResponse as any)?.data || [],
    filteredMembership: (membershipResponse as any)?.data || [],
    totalPages: (membershipResponse as any)?.pageTotal || 1,
    totalData: (membershipResponse as any)?.total || 0,
    totalItems: (membershipResponse as any)?.total || 0,
    channels,

    page,
    rowsPerPage,
    tab,
    searchData,
    channel,

    setPage,
    setRowsPerPage,
    setTab,
    setSearchData,
    setChannel,

    isLoading,
    isError,
    error,
    isFetching,
    isLoadingChannels,

    refetch,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleChannelChange,
    handleExport,
    handleUpload,
    goToDetail,
    getStatusColor,
  };
}
