import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";
import { usePages } from "@/services/auth/hooks/queries";
import { useDeletePage } from "@/services/auth/hooks/mutations";

export function usePageManagement() {
  const router = useRouter();
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPageState] = useState(10);
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
    data: pagesResponse,
    isLoading,
    isError,
    error,
  } = usePages(
    { page, pageSize: rowsPerPage },
    {
    enabled: hasAccess === true,
    staleTime: 300000,
    refetchOnWindowFocus: false,
    }
  );

  const deleteMutation = useDeletePage({
    onSuccess: () => {
      toast.success("Page deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete failed:", error);
      toast.error(error?.response?.data?.message || "Failed to delete page");
    },
  });

  const handleEdit = (id: string) => {
    router.push(`${AppURL.masterdataPageManagementDetail}/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const addNewPage = () => {
    router.push(AppURL.masterdataPageManagementAdd);
  };

  const setRowsPerPage = useCallback((newRowsPerPage: number) => {
    setRowsPerPageState(newRowsPerPage);
    setPage(1);
  }, []);

  return {
    pages: (pagesResponse as any)?.data || [],
    totalPages: (pagesResponse as any)?.meta?.pageTotal || 1,
    totalItems: (pagesResponse as any)?.meta?.total || 0,
    page,
    rowsPerPage,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading: isLoading || hasAccess === null,
    isError,
    error,
    setPage,
    setRowsPerPage,
    handleEdit,
    handleDelete,
    addNewPage,
    isDeleting: deleteMutation.isPending,
  };
}

