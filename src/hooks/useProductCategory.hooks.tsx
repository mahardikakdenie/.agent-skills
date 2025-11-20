import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import {
  ProductCategories,
  ProductCategoriesService,
} from "@/services/masterdata/product-category.service";
import AppURL from "@/constants/app-url.const";

interface UseProductCategoryProps {
  categories: ProductCategories[];

  hasAccess: boolean | null;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;

  isLoading: boolean;
  isError: boolean;
  error: any;
  isDeleting: boolean;

  refetch: () => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  addNewCategory: () => void;
}

export function useProductCategory(): UseProductCategoryProps {
  const router = useRouter();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();
  const productCategoryService = new ProductCategoriesService();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

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
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const result = await productCategoryService.getCategories();
      return result;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await productCategoryService.deleteCategories(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
    onError: (error) => {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    },
  });

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`${AppURL.masterdataProductCategoryDetail}/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this category?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const addNewCategory = useCallback(() => {
    router.push(AppURL.masterdataProductCategoryAdd);
  }, [router]);

  return {
    categories,

    hasAccess,
    canEdit,
    canCreate,
    canDelete,

    isLoading,
    isError,
    error,
    isDeleting: deleteMutation.isPending,

    refetch,
    handleEdit,
    handleDelete,
    addNewCategory,
  };
}
