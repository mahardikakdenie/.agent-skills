import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';
import { channelService } from '@/services/channel/api/channel.service';
import { productService } from '@/services/product/api/product.service';
import { promotionService } from '@/services/promotion/api/promotion.service';
import { useDeleteCampaign } from '@/services/promotion/hooks/mutations/useDeleteCampaign';
import { useCampaignSearch } from '@/services/promotion/hooks/queries/useCampaignSearch';

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
  embedded_discount_channels?: { channel_id: string; channel_name?: string }[];
  embedded_discount_insurances?: { insurance_id: string; insurance_name?: string }[];
  embedded_discount_products?: { product_id: string; product_name?: string }[];
  embedded_discount_plans?: { plan_id: string; name?: string }[];
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
  isDetailLoading: boolean;
  isError: boolean;
  detailError: string | null;
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

const normalizeCampaignDetail = (response: any): PromotionItem | null => {
  return (
    response?.data?.[0] ??
    response?.data?.data?.[0] ??
    response?.data?.data ??
    response?.data ??
    null
  );
};

const toArray = <T,>(value: T[] | null | undefined): T[] => (Array.isArray(value) ? value : []);

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

const normalizeResponseItem = (response: unknown): UnknownRecord | null => {
  if (!isRecord(response)) {
    return null;
  }

  const data = response.data;

  if (Array.isArray(data)) {
    return isRecord(data[0]) ? data[0] : null;
  }

  if (isRecord(data)) {
    if (Array.isArray(data.data)) {
      return isRecord(data.data[0]) ? data.data[0] : null;
    }

    return data;
  }

  return response;
};

const getStringValue = (value: unknown) => (typeof value === 'string' ? value : '');

const getNestedName = (item: UnknownRecord, key: string) => {
  const nestedValue = item[key];
  return isRecord(nestedValue) ? getStringValue(nestedValue.name) : '';
};

const getRelationName = (item: unknown, primaryNameKey: string) => {
  if (!isRecord(item)) {
    return '';
  }

  return (
    getStringValue(item[primaryNameKey]) ||
    getStringValue(item.name) ||
    getNestedName(item, 'channel') ||
    getNestedName(item, 'insurance') ||
    getNestedName(item, 'product') ||
    getNestedName(item, 'plan')
  );
};

const buildRelationNameMap = (
  relations: UnknownRecord[],
  idKey: string,
  nameKey: string,
  responses: PromiseSettledResult<unknown>[],
  responseAliasKeys: string[] = [],
) => {
  const entries: [string, string][] = [];

  relations.forEach((relation, index) => {
    const relationId = getStringValue(relation[idKey]);
    const responseItem =
      responses[index]?.status === 'fulfilled'
        ? normalizeResponseItem(responses[index].value)
        : null;
    const responseName = getRelationName(responseItem, 'name');
    const relationName = getRelationName(relation, nameKey) || responseName;

    if (relationId && relationName) {
      entries.push([relationId, relationName]);
    }

    if (!responseItem || !responseName) {
      return;
    }

    Array.from(new Set(['id', idKey, ...responseAliasKeys])).forEach((aliasKey) => {
      const aliasId = getStringValue(responseItem[aliasKey]);
      if (aliasId) {
        entries.push([aliasId, responseName]);
      }
    });
  });

  return new Map(entries);
};

export function useCampaign(): UseCampaignProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPageState] = useState(() => {
    return parseInt(searchParams.get('page') || '1', 10);
  });

  const [rowsPerPage, setRowsPerPageState] = useState(() => {
    return parseInt(searchParams.get('limit') || '10', 10);
  });

  const [searchData, setSearchDataState] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const [channelNames, setChannelNames] = useState<Map<string, string>>(new Map());
  const [insuranceNames, setInsuranceNames] = useState<Map<string, string>>(new Map());
  const [productNames, setProductNames] = useState<Map<string, string>>(new Map());
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
        if (value !== undefined && value !== null && value !== '') {
          current.set(key, String(value));
        } else {
          current.delete(key);
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : '';

      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setPage = useCallback(
    (newPage: number) => {
      setPageState(newPage);
      updateURL({ page: newPage });
    },
    [updateURL],
  );

  const setRowsPerPage = useCallback(
    (newRowsPerPage: number) => {
      setRowsPerPageState(newRowsPerPage);
      setPageState(1);
      updateURL({ limit: newRowsPerPage, page: 1 });
    },
    [updateURL],
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
      const access = permissionList.includes('Promotions.Read');
      const deleteBtn = permissionList.includes('Promotions.Delete');
      const editBtn = permissionList.includes('Promotions.Update');

      setCanDelete(deleteBtn);
      setCanEdit(editBtn);
      setHasAccess(access);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const campaignParams = {
    page: page,
    limit: rowsPerPage,
    query: searchData ? searchData : '',
  };

  const {
    data: promotionsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useCampaignSearch(campaignParams, {
    enabled: hasAccess === true,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const promotions = {
    data: (promotionsResponse as any)?.data || [],
    total: (promotionsResponse as any)?.total || 0,
    pageTotal: (promotionsResponse as any)?.pageTotal || 1,
  };

  const deleteMutation = useDeleteCampaign({
    onSuccess: async () => {
      await productService.syncEmbeddedDiscounts();
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error) => {
      console.error('Failed to delete campaign:', error);
    },
  });

  const getStatusColor = useCallback((status: boolean) => {
    switch (status) {
      case false:
        return 'text-[#FF0000]';
      case true:
        return 'text-[#00AB4F]';
      default:
        return 'text-[#FF0000]';
    }
  }, []);

  const renderStatus = useCallback((isActive: boolean) => (isActive ? 'ACTIVE' : 'NOT ACTIVE'), []);

  const handleEditCampaign = useCallback(
    (id: string) => {
      router.push(`${AppURL.promotionCampaignEdit}/${id}`);
    },
    [router],
  );

  const handleViewDetail = useCallback(async (id: string) => {
    setDrawerOpen(true);
    setIsDetailLoading(true);
    setDetailError(null);
    setSelectedPromotion(null);
    setChannelNames(new Map());
    setInsuranceNames(new Map());
    setProductNames(new Map());
    setPlanNames(new Map());
    setVouchers([]);
    setEmbeddedDiscount([]);

    try {
      const response: any = await promotionService.getCampaignById(id);
      const promotionData = normalizeCampaignDetail(response);
      setSelectedPromotion(promotionData);

      if (!promotionData) {
        setDetailError('Campaign details are not available.');
        return;
      }

      const fetchNames = async () => {
        const channels = toArray(promotionData.embedded_discount_channels);
        const insurances = toArray(promotionData.embedded_discount_insurances);
        const products = toArray(promotionData.embedded_discount_products);
        const plans = toArray(promotionData.embedded_discount_plans);

        const channelFetches = channels.map(async (channel: { channel_id: string }) => {
          const res: any = await channelService.getChannelByIdV1(channel.channel_id);
          return normalizeResponseItem(res);
        });
        const insuranceFetches = insurances.map(async (insurance: { insurance_id: string }) => {
          const res: any = await productService.getInsuranceById(insurance.insurance_id);
          return normalizeResponseItem(res);
        });
        const productFetches = products.map(async (product: { product_id: string }) => {
          return productService.getProductById(product.product_id);
        });
        const planFetches = plans.map(async (plan: { plan_id: string }) => {
          const res: any = await productService.getPlanById(plan.plan_id);
          return normalizeResponseItem(res);
        });

        const [channelResponses, insuranceResponses, productResponses, planResponses] =
          await Promise.all([
            Promise.allSettled(channelFetches),
            Promise.allSettled(insuranceFetches),
            Promise.allSettled(productFetches),
            Promise.allSettled(planFetches),
          ]);

        setChannelNames(
          buildRelationNameMap(
            channels as UnknownRecord[],
            'channel_id',
            'channel_name',
            channelResponses,
          ),
        );
        setInsuranceNames(
          buildRelationNameMap(
            insurances as UnknownRecord[],
            'insurance_id',
            'insurance_name',
            insuranceResponses,
          ),
        );
        setProductNames(
          buildRelationNameMap(
            products as UnknownRecord[],
            'product_id',
            'product_name',
            productResponses,
          ),
        );
        setPlanNames(
          buildRelationNameMap(plans as UnknownRecord[], 'plan_id', 'name', planResponses),
        );
      };

      if (promotionData.type === 'voucher') {
        try {
          const vouchersResponse: any = await promotionService.getVoucherById(
            promotionData.campaign_id,
          );
          setVouchers(vouchersResponse?.data?.data ?? vouchersResponse?.data ?? []);
        } catch (err) {
          console.warn('Failed to fetch campaign vouchers:', err);
          setVouchers([]);
        }
      }

      if (promotionData.type === 'embedded') {
        try {
          const embeddedHistory: any = await promotionService.getCampaignHistory(id);
          const embeddedData =
            embeddedHistory?.data?.data ?? embeddedHistory?.data ?? embeddedHistory;
          if (embeddedData) {
            setEmbeddedDiscount(Array.isArray(embeddedData) ? embeddedData : [embeddedData]);
          } else {
            setEmbeddedDiscount([]);
          }
        } catch (err) {
          console.warn('Failed to fetch embedded campaign history:', err);
          setEmbeddedDiscount([]);
        }
      }

      try {
        await fetchNames();
      } catch (err) {
        console.warn('Failed to fetch campaign relation names:', err);
      }
    } catch (err) {
      console.error('Failed to fetch promotion details:', err);
      setDetailError('Failed to load campaign details.');
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this campaign?')) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation],
  );

  const addNewCampaign = useCallback(() => {
    router.push(AppURL.promotionCampaignAdd);
  }, [router]);

  const handleSearch = useCallback(
    _.debounce((keyword: string) => {
      setSearchData(keyword);
    }, 500),
    [],
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
    isDetailLoading,
    isError,
    detailError,
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
