import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import { useInsurances } from "@/services/product/hooks/queries";

interface Insurance {
  id: string;
  name: string;
  updated_at: string;
}

interface UseCurrencyProps {
  insurances: Insurance[];
  totalPages: number;
  totalItems: number;

  page: number;
  rowsPerPage: number;

  hasAccess: boolean | null;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;

  isLoading: boolean;
  isError: boolean;
  error: any;

  refetch: () => void;
  handleEdit: (id: string) => void;
  addNewCurrency: () => void;
}

export function useCurrency(): UseCurrencyProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { permissionList } = useAuth();

  const [page, setPageState] = useState(() => {
    return parseInt(searchParams.get("page") || "1", 10);
  });

  const [rowsPerPage, setRowsPerPageState] = useState(() => {
    return parseInt(searchParams.get("limit") || "10", 10);
  });

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

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

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Read");
      const editBtn = permissionList.includes("Masterdata.Update");
      const deleteBtn = permissionList.includes("Masterdata.Delete");
      const createBtn = permissionList.includes("Masterdata.Create");

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
    },
    {
      enabled: !!hasAccess,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  const insuranceData: any = insuranceResponse;

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`${AppURL.masterdataCurrencyDetail}/${id}`);
    },
    [router]
  );

  const addNewCurrency = useCallback(() => {
    router.push(AppURL.masterdataCurrencyAdd);
  }, [router]);

  return {
    insurances: insuranceData?.data || [],
    totalPages: insuranceData?.meta?.pageTotal || 1,
    totalItems: insuranceData?.meta?.total || 0,

    page,
    rowsPerPage,

    hasAccess,
    canEdit,
    canCreate,
    canDelete,

    setPage,
    setRowsPerPage,

    isLoading,
    isError,
    error,

    refetch,
    handleEdit,
    addNewCurrency,
  };
}
