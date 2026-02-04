import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PagesService } from "@/services/masterdata/page.service";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";

export function usePageManagement() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pagesService = new PagesService();
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
  } = useQuery({
    queryKey: ["pages", page, rowsPerPage],
    queryFn: async () => {
      const response = await pagesService.getPages(page, rowsPerPage);
      return response;
    },
    enabled: hasAccess === true,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await pagesService.deletePages(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
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
    pages: pagesResponse?.data || [],
    totalPages: pagesResponse?.meta?.pageTotal || 1,
    totalItems: pagesResponse?.meta?.total || 0,
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
