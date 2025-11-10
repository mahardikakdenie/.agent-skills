import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChannelService } from "@/services/channel.services";
import { ProductService } from "@/services/product.services";
import { TransactionService } from "@/services/transaction.service";

interface FilterItem {
  key_id: string;
  label: string;
  value: string;
  valueView: string;
}

interface UseExportUsersProps {
  customers: any[];
  totalPages: number;
  totalItems: number;
  dataToDownload: any[];

  channelList: any[];
  productList: any[];
  planList: any[];
  monthList: any[];
  filterOptions: any[];

  page: number;
  limit: number;

  filteredUsers: FilterItem[];
  isFiltered: boolean;

  selectedFilter: string;
  channel: string;
  product: string;
  plan: string;
  frequentBuyersSign: string;
  frequentBuyersValue: number;
  birthdayMonth: string;

  setPage: (page: number) => void;
  setSelectedFilter: (filter: string) => void;
  setChannel: (channel: string) => void;
  setProduct: (product: string) => void;
  setPlan: (plan: string) => void;
  setFrequentBuyersSign: (sign: string) => void;
  setFrequentBuyersValue: (value: number) => void;
  setBirthdayMonth: (month: string) => void;

  handleAddFilterData: () => void;
  handleDeleteSelectedFilter: (index: number) => void;
  handleGetFilteredData: () => void;
  resetAllFilters: () => void;
  handleGenerateXlsx: () => void;
  handleLimitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  isLoading: boolean;
  isLoadingFilters: boolean;

  planSearchQuery: string;
  handlePlanSearch: (query: string) => void;
  isSearchingPlans: boolean;
}

export function useExportUsers(): UseExportUsersProps {
  const channelService = useMemo(() => new ChannelService(), []);
  const productService = useMemo(() => new ProductService(), []);
  const transactionService = useMemo(() => new TransactionService(), []);

  const [page, setPageState] = useState(1);
  const [limit, setLimitState] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [filteredUsers, setFilteredUsers] = useState<FilterItem[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [dataToDownload, setDataToDownload] = useState<any[]>([]);

  const [selectedFilter, setSelectedFilter] = useState("");
  const [channel, setChannel] = useState("");
  const [product, setProduct] = useState("");
  const [plan, setPlan] = useState("");
  const [frequentBuyersSign, setFrequentBuyersSign] = useState("");
  const [frequentBuyersValue, setFrequentBuyersValue] = useState(1);
  const [birthdayMonth, setBirthdayMonth] = useState("");

  const [channelName, setChannelName] = useState("");
  const [productName, setProductName] = useState("");
  const [planName, setPlanName] = useState("");

  const monthList = useMemo(
    () => [
      { id: "01", name: "January" },
      { id: "02", name: "February" },
      { id: "03", name: "March" },
      { id: "04", name: "April" },
      { id: "05", name: "May" },
      { id: "06", name: "June" },
      { id: "07", name: "July" },
      { id: "08", name: "August" },
      { id: "09", name: "September" },
      { id: "10", name: "October" },
      { id: "11", name: "November" },
      { id: "12", name: "December" },
    ],
    []
  );

  const filterOptions = useMemo(
    () => [
      { name: "Channel", id: "channel_id", active: true },
      { name: "Product", id: "product_id", active: true },
      { name: "Plan", id: "plan_id", active: true },
      { name: "Transaction", id: "frequent_buyers", active: true },
      { name: "Birthday Month", id: "birthday_month", active: true },
    ],
    []
  );

  const { data: channelData, isLoading: isLoadingChannels } = useQuery({
    queryKey: ["export-channels"],
    queryFn: async () => {
      const allChannels: any[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await channelService.getChannels(currentPage, 100);
        if (response?.data) {
          allChannels.push(...response.data);
          hasMore = currentPage < response.pageTotal;
          currentPage++;
        } else {
          hasMore = false;
        }
      }

      return allChannels;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: productData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["export-products"],
    queryFn: async () => {
      const allProducts: any[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await productService.get100Products(currentPage);
        if (response?.data) {
          allProducts.push(...response.data);
          hasMore = currentPage < response.meta.pageTotal;
          currentPage++;
        } else {
          hasMore = false;
        }
      }

      return allProducts;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [planSearchQuery, setPlanSearchQuery] = useState("");
  const [debouncedPlanSearch, setDebouncedPlanSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPlanSearch(planSearchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [planSearchQuery]);

  const { data: planData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["export-plans", debouncedPlanSearch],
    queryFn: async () => {
      const response = await productService.get100Plans(1, debouncedPlanSearch);
      return response?.data || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handlePlanSearch = useCallback((query: string) => {
    setPlanSearchQuery(query);
  }, []);

  const processingFilteredUser = useCallback(() => {
    const selectedChannel = filteredUsers
      .filter((f) => f.key_id === "channel_id")
      .map((f) => f.value);
    const selectedProduct = filteredUsers
      .filter((f) => f.key_id === "product_id")
      .map((f) => f.value);
    const selectedPlan = filteredUsers
      .filter((f) => f.key_id === "plan_id")
      .map((f) => f.value);
    const selectedFrequentBuyers = filteredUsers
      .filter((f) => f.key_id === "frequent_buyers")
      .map((f) => f.value);
    const selectedBirthdayMonth = filteredUsers
      .filter((f) => f.key_id === "birthday_month")
      .map((f) => f.value);

    return {
      selectedChannel,
      selectedProduct,
      selectedPlan,
      selectedFrequentBuyers,
      selectedBirthdayMonth,
    };
  }, [filteredUsers]);

  const {
    data: customersData,
    isLoading: isLoadingCustomers,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["export-customers", page, limit, JSON.stringify(filteredUsers)],
    queryFn: async () => {
      const {
        selectedChannel,
        selectedProduct,
        selectedPlan,
        selectedFrequentBuyers,
        selectedBirthdayMonth,
      } = processingFilteredUser();

      const response = await transactionService.getCustomersCampaign(
        page,
        limit,
        selectedChannel,
        selectedProduct,
        selectedPlan,
        selectedFrequentBuyers,
        selectedBirthdayMonth
      );

      setTotalPages(response.pageTotal);
      setTotalItems(response.total);

      return response.data;
    },
    enabled: isFiltered && filteredUsers.length > 0,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const fetchAllDataToDownload = useCallback(async () => {
    const {
      selectedChannel,
      selectedProduct,
      selectedPlan,
      selectedFrequentBuyers,
      selectedBirthdayMonth,
    } = processingFilteredUser();

    const allData: any[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await transactionService.getCustomersCampaign(
        currentPage,
        1000,
        selectedChannel,
        selectedProduct,
        selectedPlan,
        selectedFrequentBuyers,
        selectedBirthdayMonth
      );

      if (response?.data) {
        allData.push(...response.data);
        hasMore = currentPage < response.pageTotal;
        currentPage++;
      } else {
        hasMore = false;
      }
    }

    setDataToDownload(allData);
  }, [processingFilteredUser, transactionService]);

  const handleChannelChange = useCallback(
    (value: string) => {
      const selectedChannel = channelData?.find((c: any) => c.id === value);
      setChannel(value);
      setChannelName(selectedChannel?.name || "");
    },
    [channelData]
  );

  const handleProductChange = useCallback(
    (value: string) => {
      const selectedProduct = productData?.find((p: any) => p.id === value);
      setProduct(value);
      setProductName(selectedProduct?.name || "");
    },
    [productData]
  );

  const handlePlanChange = useCallback(
    (value: string) => {
      const selectedPlan = planData?.find((p: any) => p.id === value);
      setPlan(value);
      setPlanName(selectedPlan?.name || "");
    },
    [planData]
  );

  const handleAddFilterData = useCallback(() => {
    const filters = [
      {
        condition: channel,
        value: {
          key_id: "channel_id",
          label: "Channel",
          value: channel,
          valueView: channelName,
        },
      },
      {
        condition: product,
        value: {
          key_id: "product_id",
          label: "Product",
          value: product,
          valueView: productName,
        },
      },
      {
        condition: plan,
        value: {
          key_id: "plan_id",
          label: "Plan",
          value: plan,
          valueView: planName,
        },
      },
      {
        condition: frequentBuyersSign && frequentBuyersValue,
        value: {
          key_id: "frequent_buyers",
          label: "Transaction",
          value: `${frequentBuyersSign}|${frequentBuyersValue}`,
          valueView: `${frequentBuyersSign} ${frequentBuyersValue}`,
        },
      },
      {
        condition: birthdayMonth,
        value: {
          key_id: "birthday_month",
          label: "Birthday Month",
          value: birthdayMonth,
          valueView: monthList.find((m: any) => m.id === birthdayMonth)?.name,
        },
      },
    ].reduce(
      (acc: FilterItem[], item) => {
        if (item.condition) acc.push(item.value as FilterItem);
        return acc;
      },
      [...filteredUsers]
    );

    setFilteredUsers(filters);

    setChannel("");
    setChannelName("");
    setProduct("");
    setProductName("");
    setPlan("");
    setPlanName("");
    setFrequentBuyersSign("");
    setFrequentBuyersValue(1);
    setBirthdayMonth("");
    setSelectedFilter("");
  }, [
    channel,
    channelName,
    product,
    productName,
    plan,
    planName,
    frequentBuyersSign,
    frequentBuyersValue,
    birthdayMonth,
    monthList,
    filteredUsers,
  ]);

  const handleDeleteSelectedFilter = useCallback(
    (index: number) => {
      const filters = [...filteredUsers];
      filters.splice(index, 1);
      setFilteredUsers(filters);

      if (filters.length === 0) {
        setIsFiltered(false);
        setDataToDownload([]);
      }
    },
    [filteredUsers]
  );

  const handleGetFilteredData = useCallback(async () => {
    setIsFiltered(true);
    setPageState(1);
    await refetchCustomers();
    await fetchAllDataToDownload();
  }, [refetchCustomers, fetchAllDataToDownload]);

  const resetAllFilters = useCallback(() => {
    setPageState(1);
    setLimitState(10);
    setFilteredUsers([]);
    setDataToDownload([]);
    setIsFiltered(false);
  }, []);

  const handleGenerateXlsx = useCallback(async () => {
    const XLSX = await import("xlsx");
    const { formatDateTimeWithTZ } = await import("@/lib/formatter");

    const sheetData = dataToDownload.map((item: any) => ({
      Name: item.name || "-",
      Email: item.email || "-",
      "Phone Number": item.phone || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const columnWidths: Record<string, number> = {
      Name: 100,
      Email: 100,
      "Phone Number": 100,
    };

    worksheet["!cols"] = Object.keys(columnWidths).map((key) => ({
      wpx: columnWidths[key],
    }));

    const workbook = XLSX.utils.book_new();
    const time = formatDateTimeWithTZ(new Date());
    const name = `filtered_customer_data_${time}`;
    XLSX.utils.book_append_sheet(workbook, worksheet, "customer_data");
    XLSX.writeFile(workbook, `${name}.xlsx`);
  }, [dataToDownload]);

  const handleLimitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLimitState(Number(e.target.value));
      setPageState(1);
    },
    []
  );

  const setChannelWithName = useCallback(
    (value: string) => {
      handleChannelChange(value);
    },
    [handleChannelChange]
  );

  const setProductWithName = useCallback(
    (value: string) => {
      handleProductChange(value);
    },
    [handleProductChange]
  );

  const setPlanWithName = useCallback(
    (value: string) => {
      handlePlanChange(value);
    },
    [handlePlanChange]
  );

  console.log(isLoadingChannels, "DY: isLoadingChannels");
  console.log(isLoadingProducts, "DY: isLoadingProducts");
  console.log(isLoadingPlans, "DY: isLoadingPlans");

  return {
    customers: customersData || [],
    totalPages,
    totalItems,
    dataToDownload,

    channelList: channelData || [],
    productList: productData || [],
    planList: planData || [],
    monthList,
    filterOptions,

    page,
    limit,

    filteredUsers,
    isFiltered,

    selectedFilter,
    channel,
    product,
    plan,
    frequentBuyersSign,
    frequentBuyersValue,
    birthdayMonth,

    setPage: setPageState,
    setSelectedFilter,
    setChannel: setChannelWithName,
    setProduct: setProductWithName,
    setPlan: setPlanWithName,
    setFrequentBuyersSign,
    setFrequentBuyersValue,
    setBirthdayMonth,

    handleAddFilterData,
    handleDeleteSelectedFilter,
    handleGetFilteredData,
    resetAllFilters,
    handleGenerateXlsx,
    handleLimitChange,

    isLoading: isLoadingCustomers,
    isLoadingFilters: isLoadingChannels || isLoadingProducts || isLoadingPlans,

    planSearchQuery,
    handlePlanSearch,
    isSearchingPlans: isLoadingPlans && debouncedPlanSearch !== "",
  };
}
