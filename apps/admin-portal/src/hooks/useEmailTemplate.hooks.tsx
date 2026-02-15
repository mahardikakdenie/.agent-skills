import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";
import {
  useCategories,
  useEmailTemplatesJourney,
} from "@/services/product/hooks/queries";
import { useDeleteEmailTemplateJourney } from "@/services/product/hooks/mutations";

export function useEmailTemplate() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTab, setSelectedTab] = useState("");
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

  const { data: categoriesResponse } = useCategories(undefined, {
    enabled: hasAccess === true,
    staleTime: 300000,
  });

  const categoriesData: any = categoriesResponse;
  const categories = categoriesData?.data ?? categoriesData ?? [];

  useEffect(() => {
    if (categories.length > 0 && !selectedTab) {
      setSelectedTab(categories[0].id);
    }
  }, [categories, selectedTab]);

  const {
    data: templatesResponse,
    isLoading,
    isError,
    error,
  } = useEmailTemplatesJourney(
    {
        page,
        pageSize: rowsPerPage,
        category: selectedTab === "Travel" ? "" : selectedTab,
    },
    {
      enabled: hasAccess === true && !!selectedTab,
      staleTime: 300000,
      refetchOnWindowFocus: false,
    },
  );

  const templatesData: any = templatesResponse;

  const deleteMutation = useDeleteEmailTemplateJourney({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast.success("Email template deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete failed:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete email template"
      );
    },
  });

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`${AppURL.masterdataEmailTemplateDetail}/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        window.confirm("Are you sure you want to delete this email template?")
      ) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation]
  );

  const addNewTemplate = useCallback(() => {
    router.push(AppURL.masterdataEmailTemplateAdd);
  }, [router]);

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const handleTabChange = useCallback((tabId: string) => {
    setSelectedTab(tabId);
    setPage(1);
  }, []);

  return {
    templates: templatesData?.data || [],
    totalPages: templatesData?.meta?.pageTotal || 1,
    totalItems: templatesData?.meta?.total || 0,
    categories,
    page,
    rowsPerPage,
    selectedTab,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading: isLoading || hasAccess === null,
    isError,
    error,
    setPage,
    handleRowsPerPageChange,
    handleTabChange,
    handleEdit,
    handleDelete,
    addNewTemplate,
    isDeleting: deleteMutation.isPending,
  };
}

