import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import {
  Insurance,
  InsuranceService,
} from "@/services/masterdata/insurance.service";
import AppURL from "@/constants/app-url.const";

interface UseInsuranceProps {
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
  isDeleting: boolean;

  refetch: () => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  addNewInsurance: () => void;
}

export function useInsurance(): UseInsuranceProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();
  const insuranceService = new InsuranceService();

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
  } = useQuery({
    queryKey: ["insurances", page, rowsPerPage],
    queryFn: async () => {
      const response = await insuranceService.getInsurance(page, rowsPerPage);
      return response;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await insuranceService.deleteInsurance(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurances"] });
    },
    onError: (error) => {
      console.error("Failed to delete insurance:", error);
      alert("Failed to delete insurance");
    },
  });

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`${AppURL.masterdataInsuranceDetail}/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this insurance?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const addNewInsurance = useCallback(() => {
    router.push(AppURL.masterdataInsuranceAdd);
  }, [router]);

  return {
    insurances: insuranceResponse?.data || [],
    totalPages: insuranceResponse?.meta?.pageTotal || 1,
    totalItems: insuranceResponse?.meta?.total || 0,

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
    isDeleting: deleteMutation.isPending,

    refetch,
    handleEdit,
    handleDelete,
    addNewInsurance,
  };
}