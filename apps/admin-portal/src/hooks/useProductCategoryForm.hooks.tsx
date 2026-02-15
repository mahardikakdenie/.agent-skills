import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { productService } from "@/services/product/api/product.service";
import AppURL from "@/constants/app-url.const";

interface ProductCategoryFormData {
  name: string;
  icon: string;
}

interface UseProductCategoryFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;
  setValue: any;
  watch: any;

  hasAccess: boolean | null;
  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;

  isLoadingDetail: boolean;
  isSaving: boolean;

  handleSave: (formData: ProductCategoryFormData) => void;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
  loadCategoryDetail: (id: string) => void;
}

export function useProductCategoryForm(
  mode: "create" | "edit" = "create"
): UseProductCategoryFormProps {
  const router = useRouter();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductCategoryFormData>({
    shouldUnregister: false,
    defaultValues: {
      name: "",
      icon: "",
    },
  });

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    const checkAccess = async () => {
      const requiredPermission = isEdit
        ? "Masterdata.Update"
        : "Masterdata.Create";
      const access = permissionList.includes(requiredPermission);
      setHasAccess(access);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList, isEdit]);

  const { data: categoryDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["product-category-detail", categoryId],
    queryFn: async () => {
      if (!categoryId) return null;

      const response: any = await productService.getCategoryById(categoryId);
      return response?.data ?? response;
    },
    enabled: isEdit && !!categoryId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (categoryDetail && isEdit) {
      setValue("name", categoryDetail.name || "");
      setValue("icon", categoryDetail.icon || "");
    }
  }, [categoryDetail, isEdit, setValue]);

  useEffect(() => {
    reset({
      name: "",
      icon: "",
    });

    if (categoryId) {
      queryClient.removeQueries({
        queryKey: ["product-category-detail", categoryId],
      });
    }
  }, [categoryId, reset, queryClient]);

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (isEdit && categoryId) {
        const response: any = await productService.updateCategory(categoryId, payload);
        return response;
      } else {
        const response: any = await productService.createCategory(payload);
        return response;
      }
    },
    onSuccess: (data) => {
      if (data != null) {
        setErrorMessage(
          isEdit
            ? "Product Category Updated Successfully!"
            : "Product Category Created Successfully!"
        );
      } else {
        setErrorMessage(
          isEdit
            ? "Failed to update product category. Please try again."
            : "Failed to create product category. Please try again."
        );
      }

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        queryClient.invalidateQueries({ queryKey: ["product-categories"] });
        queryClient.removeQueries({ queryKey: ["product-category-detail"] });
        router.push(AppURL.masterdataProductCategory);
      }, 2000);
    },
    onError: (error) => {
      console.error("Failed to save product category:", error);
      setErrorMessage(
        isEdit
          ? "Failed to update product category. Please try again."
          : "Failed to create product category. Please try again."
      );
      setShowAlert(true);
    },
  });

  const handleSave = useCallback(
    async (formData: ProductCategoryFormData) => {
      setErrorMessage("");
      setShowAlert(false);

      const requiredFields = ["name", "icon"];

      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof ProductCategoryFormData]
      );

      if (missingFields.length > 0) {
        setErrorMessage("Please fill in all required fields.");
        setShowAlert(true);
        return;
      }

      saveMutation.mutate(formData);
    },
    [saveMutation]
  );

  const goBack = useCallback(() => {
    router.push(AppURL.masterdataProductCategory);
  }, [router]);

  const loadCategoryDetail = useCallback((id: string) => {
    setCategoryId(id);
  }, []);

  return {
    handleSubmit,
    control,
    errors,
    reset,
    setValue,
    watch,

    hasAccess,
    showAlert,
    errorMessage,
    isEdit,

    isLoadingDetail,
    isSaving: saveMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadCategoryDetail,
  };
}

