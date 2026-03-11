import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import _ from "lodash";
import ApiURL from "@/constants/api-url.const";
import {
  policyService,
  channelService,
  productService,
  helperService,
} from "@/services/api.service";

interface UsePoliciesProps {
  policies: any[];
  channels: any[];
  categories: any[];
  totalPages: number;
  totalItems: number;
  totalData: number;

  page: number;
  rowsPerPage: number;
  tab: string;
  searchData: string;
  searchChannel: string;
  searchCategory: string;
  date: DateRange | undefined;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setTab: (tab: string) => void;
  setSearchData: (search: string) => void;
  setSearchChannel: (channel: string) => void;
  setSearchCategory: (category: string) => void;
  setDate: (date: DateRange | undefined) => void;

  isLoading: boolean;
  isLoadingChannels: boolean;
  isLoadingCategories: boolean;
  isError: boolean;
  error: any;
  isFetching: boolean;

  refetch: () => void;
  handleSearch: (keyword: string) => void;
  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectTab: (tab: string) => void;
  handleChannelChange: (channel: string) => void;
  handleCategoryChange: (category: string) => void;
  handleClear: () => void;
}

export default function usePolicies(
  isPendingRenewal?: boolean,
): UsePoliciesProps {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tab, setTab] = useState("All");
  const [searchData, setSearchData] = useState("");
  const [searchChannel, setSearchChannel] = useState(
    "40eee5bf-2b92-4d23-be55-f9caa9d3ea88",
  );
  const [searchCategory, setSearchCategory] = useState("All");
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const [policies, setPolicies] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const policyQueryKey = [
    "policies",
    page,
    rowsPerPage,
    tab,
    searchData,
    searchChannel,
    searchCategory,
    date?.from?.toISOString(),
    date?.to?.toISOString(),
    isPendingRenewal,
  ];

  const channelQueryKey = ["channels"];
  const categoryQueryKey = ["categories", searchChannel];

  const {
    data: resPolicies,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: policyQueryKey,
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        limit: rowsPerPage,
        keyword: searchData || undefined,
        status: tab !== "All" ? tab : undefined,
        channel: searchChannel || undefined,
        category: searchCategory !== "All" ? searchCategory : undefined,
        created_from: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
        created_to: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
        ...(isPendingRenewal && { is_need_renewal: true }),
      };

      const response = await policyService.get(ApiURL.v1Policies, { params });
      return response.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { data: resChannels, isFetching: isLoadingChannels } = useQuery({
    queryKey: channelQueryKey,
    queryFn: async () => {
      const response = await channelService.get(ApiURL.v1Channels, {
        params: { page: 1, limit: 10000 },
      });
      return response.data;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const { data: resCategories, isFetching: isLoadingCategories } = useQuery({
    queryKey: categoryQueryKey,
    queryFn: async () => {
      if (!searchChannel) return { data: [] };
      const response = await productService.get(
        ApiURL.v1CategoriesChannelDetails(searchChannel),
      );
      return response.data;
    },
    enabled: !!searchChannel,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (resPolicies?.data) {
      setPolicies(resPolicies.data);
    } else {
      setPolicies([]);
    }
  }, [resPolicies?.data]);

  useEffect(() => {
    if (resChannels?.data) {
      setChannels(resChannels.data);
    }
  }, [resChannels?.data]);

  useEffect(() => {
    if (resCategories?.data) {
      setCategories(resCategories.data);
    } else {
      setCategories([]);
    }
  }, [resCategories?.data]);

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

  const selectTab = useCallback((tabName: string) => {
    setTab(tabName);
    setPage(1);
  }, []);

  const handleChannelChange = useCallback((channel: string) => {
    setSearchChannel(channel);
    setSearchCategory("All");
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSearchCategory(category);
    setPage(1);
  }, []);

  const handleClear = useCallback(() => {
    setDate(undefined);
  }, []);

  useEffect(() => {
    if (
      searchData ||
      searchChannel ||
      searchCategory ||
      date?.from ||
      date?.to
    ) {
      setPage(1);
    }
  }, [searchData, searchChannel, searchCategory, date?.from, date?.to]);

  useEffect(() => {
    return () => {
      handleSearch.cancel?.();
    };
  }, [handleSearch]);


  useEffect(() => {
    const currentDate = new Date();
    const last30DaysDate = new Date(currentDate);
    last30DaysDate.setDate(currentDate.getDate() - 30);

    setDate({
      from: last30DaysDate,
      to: currentDate,
    });
  }, [])

  return {
    policies,
    channels,
    categories,
    totalPages: resPolicies?.pageTotal || 1,
    totalItems: resPolicies?.total || 0,
    totalData: resPolicies?.total || 0,

    page,
    rowsPerPage,
    tab,
    searchData,
    searchChannel,
    searchCategory,
    date,

    setPage,
    setRowsPerPage,
    setTab,
    setSearchData,
    setSearchChannel,
    setSearchCategory,
    setDate,

    isLoading,
    isLoadingChannels,
    isLoadingCategories,
    isError,
    error,
    isFetching,

    refetch,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleChannelChange,
    handleCategoryChange,
    handleClear,
  };
}
