import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { productService } from "@/services/product/api/product.service";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";

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

  const { data: categoriesData } = useQuery({
    queryKey: ["email-template-categories"],
    queryFn: async () => {
      const response: any = await productService.getCategories();
      return response?.data ?? response;
    },
    enabled: hasAccess === true,
    staleTime: 300000,
  });

  useEffect(() => {
    if (categoriesData && categoriesData.length > 0 && !selectedTab) {
      setSelectedTab(categoriesData[0].id);
    }
  }, [categoriesData, selectedTab]);

  const {
    data: templatesResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["email-templates", page, rowsPerPage, selectedTab],
    queryFn: async () => {
      const response: any = await productService.getEmailTemplatesJourney({
        page,
        pageSize: rowsPerPage,
        category: selectedTab === "Travel" ? "" : selectedTab,
      });
      return response;
    },
    enabled: hasAccess === true && !!selectedTab,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await productService.deleteEmailTemplateJourney(id);
    },
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
    templates: templatesResponse?.data || [],
    totalPages: templatesResponse?.meta?.pageTotal || 1,
    totalItems: templatesResponse?.meta?.total || 0,
    categories: categoriesData || [],
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

