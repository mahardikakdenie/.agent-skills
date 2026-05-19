import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';
import type { Insurance } from '@/services/product/api/product.types';
import { useCategories, useInsurances } from '@/services/product/hooks/queries';

interface UseProductProps {
  insurances: Insurance[];
  categories: any[];
  totalPages: number;
  totalItems: number;

  page: number;
  rowsPerPage: number;
  selectedTab: string;

  hasAccess: boolean | null;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  selectTab: (tabId: string) => void;

  isLoading: boolean;
  isLoadingCategories: boolean;
  isError: boolean;
  error: any;

  refetch: () => void;
  handleEdit: (insuranceId: string) => void;
  addNewProduct: () => void;
}

export function useProduct(): UseProductProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { permissionList } = useAuth();

  const [page, setPageState] = useState(() => {
    return parseInt(searchParams.get('page') || '1', 10);
  });

  const [rowsPerPage, setRowsPerPageState] = useState(() => {
    return parseInt(searchParams.get('limit') || '10', 10);
  });

  const [selectedTab, setSelectedTab] = useState<string>(() => {
    return searchParams.get('tab') || '';
  });

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

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

  const selectTab = useCallback(
    (tabId: string) => {
      setSelectedTab(tabId);
      setPageState(1);
      updateURL({ tab: tabId, page: 1 });
    },
    [updateURL],
  );

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes('Masterdata.Read');
      const editBtn = permissionList.includes('Masterdata.Update');
      const deleteBtn = permissionList.includes('Masterdata.Delete');
      const createBtn = permissionList.includes('Masterdata.Create');

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useCategories(undefined, {
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const categoriesData: any = categoriesResponse;
  const categories = categoriesData?.data ?? categoriesData ?? [];
  const activeTab = selectedTab || categories[0]?.id || '';

  useEffect(() => {
    if (categories.length > 0 && !selectedTab) {
      const tabFromUrl = searchParams.get('tab');
      const initialTab = tabFromUrl || categories[0].id;
      setSelectedTab(initialTab);
    }
  }, [categories, selectedTab, searchParams]);

  const {
    data: insuranceResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useInsurances(
    {
      page,
      pageSize: rowsPerPage,
      categoryId: activeTab === 'Travel' ? '' : activeTab,
    },
    {
      enabled: !!activeTab,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );

  const insuranceData: any = insuranceResponse;

  const handleEdit = useCallback(
    (insuranceId: string) => {
      router.push(AppURL.masterdataProductDetailWithParams(activeTab, insuranceId));
    },
    [router, activeTab],
  );

  const addNewProduct = useCallback(() => {
    router.push(AppURL.masterdataProductAdd);
  }, [router]);

  const isBootstrappingTab = isLoadingCategories || (categories.length > 0 && !selectedTab);
  const isTableLoading = isBootstrappingTab || isLoading;

  return {
    insurances: insuranceData?.data || [],
    categories,
    totalPages: insuranceData?.meta?.pageTotal || 1,
    totalItems: insuranceData?.meta?.total || 0,

    page,
    rowsPerPage,
    selectedTab: activeTab,

    hasAccess,
    canEdit,
    canCreate,
    canDelete,

    setPage,
    setRowsPerPage,
    selectTab,

    isLoading: isTableLoading,
    isLoadingCategories,
    isError,
    error,

    refetch,
    handleEdit,
    addNewProduct,
  };
}
