import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/api/auth.service";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";
import _ from "lodash";

export function usePartnerManagement() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchData, setSearchData] = useState("");
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

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
    data: partnersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["partners", page, rowsPerPage, searchData],
    queryFn: async () => {
      const response: any = await authService.getAccountPartners({
        page,
        pageSize: rowsPerPage,
        search: searchData,
      });
      return response;
    },
    enabled: hasAccess === true,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await authService.deleteAccount(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete failed:", error);
      toast.error(error?.response?.data?.message || "Failed to delete partner");
    },
  });

  useEffect(() => {
    if (searchData) {
      setPage(1);
    }
  }, [searchData]);

  const handleSearch = useMemo(
    () =>
      _.debounce((keyword: string) => {
        setSearchData(keyword);
      }, 300),
    []
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`${AppURL.masterdataPartnerManagementDetail}/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this partner?")) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation]
  );

  const addNewPartner = useCallback(() => {
    router.push(AppURL.masterdataPartnerManagementAdd);
  }, [router]);

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel?.();
    };
  }, [handleSearch]);

  return {
    partners: partnersResponse?.data || [],
    totalPages: partnersResponse?.meta?.pageTotal || 1,
    totalItems: partnersResponse?.meta?.total || 0,
    page,
    rowsPerPage,
    searchData,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading: isLoading || hasAccess === null,
    isError,
    error,
    setPage,
    setRowsPerPage,
    handleSearch,
    handleEdit,
    handleDelete,
    addNewPartner,
    handleRowsPerPageChange,
    isDeleting: deleteMutation.isPending,
    refetch,
  };
}
