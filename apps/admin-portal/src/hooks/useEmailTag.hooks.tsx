import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";
import { useEmailTags } from "@/services/product/hooks/queries";
import { useDeleteEmailTag } from "@/services/product/hooks/mutations";

export function useEmailTag() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  const { data: tagsResponse, isLoading: isLoadingTags } = useEmailTags(
    {
        page,
        pageSize: rowsPerPage,
    },
    {
      enabled: hasAccess === true,
      staleTime: 300000,
      refetchOnWindowFocus: false,
    }
  );

  const tagsData: any = tagsResponse;

  const deleteMutation = useDeleteEmailTag({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-tags"] });
      queryClient.invalidateQueries({ queryKey: ["email-template-tags"] });
      toast.success("Email tag deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete failed:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete email tag"
      );
    },
  });

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`${AppURL.masterdataEmailTag}/detail/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this email tag?")) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation]
  );

  const addNewTag = useCallback(() => {
    router.push(`${AppURL.masterdataEmailTag}/add`);
  }, [router]);

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  return {
    tags: tagsData?.data || [],
    totalPages: tagsData?.meta?.pageTotal || 1,
    totalItems: tagsData?.meta?.total || 0,
    page,
    rowsPerPage,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading: isLoadingTags || hasAccess === null,
    setPage,
    handleRowsPerPageChange,
    handleEdit,
    handleDelete,
    addNewTag,
  };
}

