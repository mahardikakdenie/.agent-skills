import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import { channelService } from "@/services/channel/api/channel.service";
import { productService } from "@/services/product/api/product.service";
import { promotionService } from "@/services/promotion/api/promotion.service";
import _ from "lodash";

interface PromotionItem {
  campaign_id: string;
  name: string;
  type: string;
  value_currency: string;
  value_type: string;
  value: number;
  start_date: string;
  end_date: string;
  active: boolean;
  minimum_amount: number;
  maximum_amount: number;
  embedded_discount_channels: { channel_id: string }[];
  embedded_discount_insurances: { insurance_id: string }[];
  embedded_discount_products: { product_id: string }[];
  embedded_discount_plans: { plan_id: string }[];
}

interface UseCampaignProps {
  promotions: PromotionItem[];
  totalPages: number;
  totalItems: number;
  selectedPromotion: PromotionItem | null;

  page: number;
  rowsPerPage: number;
  searchData: string;

  drawerOpen: boolean;
  hasAccess: boolean | null;
  canEdit: boolean;
  canDelete: boolean;

  channelNames: Map<string, string>;
  insuranceNames: Map<string, string>;
  productNames: Map<string, string>;
  planNames: Map<string, string>;
  vouchers: { code: string; usage_limit: number; used_count: number }[];
  embeddedDiscount: {
    currency: string;
    total_discount_amount: number;
    total_transaction_amount: number;
  }[];

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setSearchData: (search: string) => void;
  setDrawerOpen: (open: boolean) => void;

  isLoading: boolean;
  isError: boolean;
  error: any;

  refetch: () => void;
  handleViewDetail: (id: string) => void;
  handleEditCampaign: (id: string) => void;
  handleDelete: (id: string) => void;
  addNewCampaign: () => void;
  handleSearch: (keyword: string) => void;
  getStatusColor: (status: boolean) => string;
  renderStatus: (isActive: boolean) => string;
}

export function useCampaign(): UseCampaignProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPageState] = useState(() => {
    return parseInt(searchParams.get("page") || "1", 10);
  });

  const [rowsPerPage, setRowsPerPageState] = useState(() => {
    return parseInt(searchParams.get("limit") || "10", 10);
  });

  const [searchData, setSearchDataState] = useState("");
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const [channelNames, setChannelNames] = useState<Map<string, string>>(
    new Map()
  );
  const [insuranceNames, setInsuranceNames] = useState<Map<string, string>>(
    new Map()
  );
  const [productNames, setProductNames] = useState<Map<string, string>>(
    new Map()
  );
  const [planNames, setPlanNames] = useState<Map<string, string>>(new Map());
  const [vouchers, setVouchers] = useState<
    { code: string; usage_limit: number; used_count: number }[]
  >([]);
  const [embeddedDiscount, setEmbeddedDiscount] = useState<
    {
      currency: string;
      total_discount_amount: number;
      total_transaction_amount: number;
    }[]
  >([]);

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

  const setSearchData = useCallback((newSearchData: string) => {
    setSearchDataState(newSearchData);
  }, []);

  useEffect(() => {
    if (searchData) {
      setPageState(1);
    }
  }, [searchData]);

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Promotions.Read");
      const deleteBtn = permissionList.includes("Promotions.Delete");
      const editBtn = permissionList.includes("Promotions.Update");

      setCanDelete(deleteBtn);
      setCanEdit(editBtn);
      setHasAccess(access);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const {
    data: promotions = [] as any,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["campaigns", page, rowsPerPage, searchData],
    queryFn: async () => {
      const params = {
        page: page,
        limit: rowsPerPage,
        query: searchData ? searchData : "",
      };

      const res: any = await promotionService.searchCampaigns(params);
      return {
        data: res?.data || [],
        total: res?.total || 0,
        pageTotal: res?.pageTotal || 1,
      };
    },
    enabled: hasAccess === true,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await promotionService.deleteCampaign(id);
      await productService.syncEmbeddedDiscounts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (error) => {
      console.error("Failed to delete campaign:", error);
    },
  });

  const getStatusColor = useCallback((status: boolean) => {
    switch (status) {
      case false:
        return "text-[#FF0000]";
      case true:
        return "text-[#00AB4F]";
      default:
        return "text-[#FF0000]";
    }
  }, []);

  const renderStatus = useCallback(
    (isActive: boolean) => (isActive ? "ACTIVE" : "NOT ACTIVE"),
    []
  );

  const handleEditCampaign = useCallback(
    (id: string) => {
      router.push(`${AppURL.promotionCampaignEdit}/${id}`);
    },
    [router]
  );

  const handleViewDetail = useCallback(async (id: string) => {
    try {
      const response: any = await promotionService.getCampaignById(id);
      const promotionData =
        response?.data?.[0] ?? response?.data?.data?.[0] ?? null;
      setSelectedPromotion(promotionData);
      setDrawerOpen(true);
      if (!promotionData) {
        return;
      }

      const fetchNames = async () => {
        const channelFetches = promotionData.embedded_discount_channels.map(
          async (channel: { channel_id: string }) => {
            const res: any = await channelService.getChannelByIdV1(
              channel.channel_id
            );
            return res?.data ?? res;
          }
        );
        const insuranceFetches = promotionData.embedded_discount_insurances.map(
          async (insurance: { insurance_id: string }) => {
            const res: any = await productService.getInsuranceById(
              insurance.insurance_id
            );
            return res?.data ?? res;
          }
        );
        const productFetches = promotionData.embedded_discount_products.map(
          async (product: { product_id: string }) => {
            return productService.getProductById(product.product_id);
          }
        );
        const planFetches = promotionData.embedded_discount_plans.map(
          async (plan: { plan_id: string }) => {
            const res: any = await productService.getPlanById(
              plan.plan_id
            );
            return res?.data ?? res;
          }
        );

        const [
          channelResponses,
          insuranceResponses,
          productResponses,
          planResponses,
        ] = await Promise.all([
          Promise.all(channelFetches),
          Promise.all(insuranceFetches),
          Promise.all(productFetches),
          Promise.all(planFetches),
        ]);

        setChannelNames(
          new Map(
            channelResponses
              .map((res: any) => {
                const normalized = res?.data ?? res;
                return normalized?.id && normalized?.name
                  ? [normalized.id, normalized.name]
                  : null;
              })
              .filter(Boolean) as [string, string][]
          )
        );
        setInsuranceNames(
          new Map(
            insuranceResponses
              .map((res: any) => {
                const normalized = res?.data ?? res;
                return normalized?.id && normalized?.name
                  ? [normalized.id, normalized.name]
                  : null;
              })
              .filter(Boolean) as [string, string][]
          )
        );
        setProductNames(
          new Map(
            productResponses
              .map((res: any) => {
                const normalized = res?.data?.[0] ?? res?.data ?? res;
                return normalized?.id && normalized?.name
                  ? [normalized.id, normalized.name]
                  : null;
              })
              .filter(Boolean) as [string, string][]
          )
        );
        setPlanNames(
          new Map(
            planResponses
              .map((res: any) => {
                const normalized = res?.data ?? res;
                return normalized?.id && normalized?.name
                  ? [normalized.id, normalized.name]
                  : null;
              })
              .filter(Boolean) as [string, string][]
          )
        );
      };

      if (promotionData.type === "voucher") {
        const vouchersResponse: any = await promotionService.getVoucherById(
          promotionData.campaign_id
        );
        setVouchers(vouchersResponse?.data ?? vouchersResponse?.data?.data ?? []);
      }

      if (promotionData.type === "embedded") {
        const embeddedHistory: any = await promotionService.getCampaignHistory(id);
        const embeddedData = embeddedHistory?.data ?? embeddedHistory;
        if (embeddedData) {
          setEmbeddedDiscount([embeddedData]);
        } else {
          setEmbeddedDiscount([]);
        }
      }

      await fetchNames();
    } catch (err) {
      console.error("Failed to fetch promotion details:", err);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this campaign?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const addNewCampaign = useCallback(() => {
    router.push(AppURL.promotionCampaignAdd);
  }, [router]);

  const handleSearch = useCallback(
    _.debounce((keyword: string) => {
      setSearchData(keyword);
    }, 500),
    []
  );

  return {
    promotions: promotions?.data || [],
    totalPages: promotions?.pageTotal || 1,
    totalItems: promotions?.total || 0,
    selectedPromotion,

    page,
    rowsPerPage,
    searchData,

    drawerOpen,
    hasAccess,
    canEdit,
    canDelete,

    channelNames,
    insuranceNames,
    productNames,
    planNames,
    vouchers,
    embeddedDiscount,

    setPage,
    setRowsPerPage,
    setSearchData,
    setDrawerOpen,

    isLoading,
    isError,
    error,

    refetch,
    handleViewDetail,
    handleEditCampaign,
    handleDelete,
    addNewCampaign,
    handleSearch,
    getStatusColor,
    renderStatus,
  };
}
