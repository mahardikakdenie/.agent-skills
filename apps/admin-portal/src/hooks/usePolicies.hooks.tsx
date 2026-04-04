import React, { useState, useCallback, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useChannelsV1 } from "@/services/channel/hooks/queries/useChannelsV1";
import { usePolicies as usePoliciesQuery } from "@/services/policy/hooks/queries/usePolicies";
import { useCategoriesByChannel } from "@/services/product/hooks/queries/useCategoriesByChannel";

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
  exporting: boolean;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setTab: (tab: string) => void;
  setSearchData: (search: string) => void;
  setSearchChannel: (channel: string) => void;
  setSearchCategory: (category: string) => void;
  setDate: (date: DateRange | undefined) => void;
  setExporting: (exporting: boolean) => void;

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
  const defaultDateRange = useMemo(() => {
    const currentDate = new Date();
    const last30DaysDate = new Date(currentDate);
    last30DaysDate.setDate(currentDate.getDate() - 30);

    return {
      from: last30DaysDate,
      to: currentDate,
    } satisfies DateRange;
  }, []);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tab, setTab] = useState("All");
  const [searchData, setSearchData] = useState("");
  const [searchChannel, setSearchChannel] = useState(
    "40eee5bf-2b92-4d23-be55-f9caa9d3ea88",
  );
  const [searchCategory, setSearchCategory] = useState("All");
  const [date, setDate] = useState<DateRange | undefined>(defaultDateRange);

  const [policies, setPolicies] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);

  const policyParams: Record<string, any> = {
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

  const {
    data: resPolicies,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = usePoliciesQuery(policyParams, {
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { data: resChannels, isFetching: isLoadingChannels } = useChannelsV1(
    {
      page: 1,
      limit: 10000,
    },
    {
      staleTime: 300000,
      refetchOnWindowFocus: false,
    },
  );

  const { data: resCategories, isFetching: isLoadingCategories } =
    useCategoriesByChannel(searchChannel || "", {
      enabled: !!searchChannel,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    const policiesData: any = resPolicies;
    if (policiesData?.data) {
      setPolicies(policiesData.data);
    } else {
      setPolicies([]);
    }
  }, [resPolicies]);

  useEffect(() => {
    const channelsData: any = resChannels;
    if (channelsData?.data) {
      setChannels(channelsData.data);
    }
  }, [resChannels]);

  useEffect(() => {
    const categoriesData: any = resCategories;
    const categoryList = categoriesData?.data || categoriesData || [];
    if (Array.isArray(categoryList)) {
      setCategories(categoryList);
    } else {
      setCategories([]);
    }
  }, [resCategories]);

  const handleSearch = useCallback((keyword: string) => {
    setSearchData(keyword);
    setPage(1);
  }, []);

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

  return {
    policies,
    channels,
    categories,
    totalPages: (resPolicies as any)?.pageTotal || 1,
    totalItems: (resPolicies as any)?.total || 0,
    totalData: (resPolicies as any)?.total || 0,

    page,
    rowsPerPage,
    tab,
    searchData,
    searchChannel,
    searchCategory,
    date,
    exporting,

    setPage,
    setRowsPerPage,
    setTab,
    setSearchData,
    setSearchChannel,
    setSearchCategory,
    setDate,
    setExporting,

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
