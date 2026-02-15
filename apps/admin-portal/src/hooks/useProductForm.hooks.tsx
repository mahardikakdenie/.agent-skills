import { useState, useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import AppURL from "@/constants/app-url.const";
import { useCategories, useInsurances, useProducts } from "@/services/product/hooks/queries";
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "@/services/product/hooks/mutations";

interface ProductField {
  id: string;
  name: string;
}

interface ProductFormData {
  category: string;
  insurance: string;
}

interface UseProductFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;
  setValue: any;
  watch: any;

  categories: any[];
  insurances: any[];
  productFields: ProductField[];

  selectedCategoryId: string;
  selectedInsuranceId: string;

  hasAccess: boolean | null;
  showAlert: boolean;
  alertMessage: string;
  alertType: "success" | "error";
  isEdit: boolean;

  isLoadingCategories: boolean;
  isLoadingInsurances: boolean;
  isLoadingProducts: boolean;
  isSaving: boolean;

  handleSave: (formData: ProductFormData) => void;
  handleAddProduct: () => void;
  handleChangeProduct: (index: number, value: string) => void;
  handleDeleteProduct: (id: string, index: number) => void;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
  loadProductDetail: (categoryId: string, insuranceId: string) => void;
}

export function useProductForm(
  mode: "create" | "edit" = "create"
): UseProductFormProps {
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
  } = useForm<ProductFormData>({
    shouldUnregister: false,
    defaultValues: {
      category: "",
      insurance: "",
    },
  });

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>("");
  const [productFields, setProductFields] = useState<ProductField[]>([
    { id: "", name: "" },
  ]);

  const categorySetRef = useRef(false);
  const insuranceSetRef = useRef(false);
  const productsSetRef = useRef(false);

  const watchCategory = watch("category");

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

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useCategories(
    undefined,
    {
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const { data: insurancesResponse, isLoading: isLoadingInsurances } = useInsurances(
    {
        page: 1,
        categoryId: selectedCategoryId,
    },
    {
      enabled: !!selectedCategoryId,
      staleTime: 300000,
      refetchOnWindowFocus: false,
    }
  );

  const { data: existingProductsResponse, isLoading: isLoadingProducts } = useProducts(
    {
        page: 1,
        pageSize: 100,
        categoryId: selectedCategoryId,
        insuranceId: selectedInsuranceId,
    },
    {
      enabled: isEdit && !!selectedCategoryId && !!selectedInsuranceId,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    }
  );

  const categoriesData: any = categoriesResponse;
  const categories = categoriesData?.data ?? categoriesData ?? [];
  const insurancesData: any = insurancesResponse;
  const insurances = insurancesData?.data ?? insurancesData ?? [];
  const existingProductsData: any = existingProductsResponse;
  const existingProducts = existingProductsData?.data ?? existingProductsData ?? [];

  useEffect(() => {
    if (!isEdit && watchCategory && watchCategory !== selectedCategoryId) {
      setSelectedCategoryId(watchCategory);
      setValue("insurance", "");
    }
  }, [watchCategory, selectedCategoryId, setValue, isEdit]);

  useEffect(() => {
    if (
      isEdit &&
      !categorySetRef.current &&
      !isLoadingCategories &&
      categories.length > 0 &&
      selectedCategoryId
    ) {
      setValue("category", selectedCategoryId, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      categorySetRef.current = true;
    }
  }, [isEdit, isLoadingCategories, categories, selectedCategoryId, setValue]);

  useEffect(() => {
    if (
      isEdit &&
      categorySetRef.current &&
      !insuranceSetRef.current &&
      !isLoadingInsurances &&
      insurances.length > 0 &&
      selectedInsuranceId
    ) {
      setValue("insurance", selectedInsuranceId, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      insuranceSetRef.current = true;
    }
  }, [isEdit, isLoadingInsurances, insurances, selectedInsuranceId, setValue]);

  useEffect(() => {
    if (
      isEdit &&
      insuranceSetRef.current &&
      !productsSetRef.current &&
      !isLoadingProducts &&
      existingProducts &&
      existingProducts.length > 0
    ) {
      const updateFormValue = existingProducts.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setProductFields(updateFormValue);
      productsSetRef.current = true;
    }
  }, [isEdit, isLoadingProducts, existingProducts]);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const deleteMutation = useDeleteProduct({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    },
  });

  const handleSave = useCallback(
    async (formData: ProductFormData) => {
      setAlertMessage("");
      setShowAlert(false);

      if (!formData.category || !formData.insurance) {
        setAlertType("error");
        setAlertMessage("Please select both Category and Insurance.");
        setShowAlert(true);
        return;
      }

      const validProducts = productFields.filter((p) => p.name.trim() !== "");
      if (validProducts.length === 0) {
        setAlertType("error");
        setAlertMessage("Please add at least one product.");
        setShowAlert(true);
        return;
      }

      try {
        for (const product of validProducts) {
          const payload = {
            category: formData.category,
            insurance: formData.insurance,
            name: product.name,
          };

          if (product.id === "") {
            await createProductMutation.mutateAsync(payload);
          } else {
            await updateProductMutation.mutateAsync({
              id: product.id,
              payload,
            });
          }
        }

        setAlertType("success");
        setAlertMessage(
          isEdit
            ? "Products Updated Successfully!"
            : "Products Created Successfully!"
        );
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          queryClient.invalidateQueries({ queryKey: ["products"] });
          queryClient.removeQueries({ queryKey: ["products-detail"] });
          router.back();
        }, 2000);
      } catch (error) {
        console.error("Failed to save products:", error);
        setAlertType("error");
        setAlertMessage("Failed to save products. Please try again.");
        setShowAlert(true);
      }
    },
    [
      createProductMutation,
      isEdit,
      productFields,
      queryClient,
      router,
      updateProductMutation,
    ]
  );

  const handleAddProduct = useCallback(() => {
    setProductFields((prev) => [...prev, { id: "", name: "" }]);
  }, []);

  const handleChangeProduct = useCallback((index: number, value: string) => {
    setProductFields((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: value };
      return updated;
    });
  }, []);

  const handleDeleteProduct = useCallback(
    async (id: string, index: number) => {
      if (id) {
        if (window.confirm("Are you sure you want to delete this product?")) {
          deleteMutation.mutate(id);
          setProductFields((prev) => prev.filter((_, i) => i !== index));
        }
      } else {
        setProductFields((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [deleteMutation]
  );

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const loadProductDetail = useCallback(
    (categoryId: string, insuranceId: string) => {
      if (
        categoryId === selectedCategoryId &&
        insuranceId === selectedInsuranceId &&
        categorySetRef.current
      ) {
        return;
      }

      categorySetRef.current = false;
      insuranceSetRef.current = false;
      productsSetRef.current = false;

      setProductFields([{ id: "", name: "" }]);

      setSelectedCategoryId(categoryId);
      setSelectedInsuranceId(insuranceId);
      setValue("insurance", insuranceId, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("category", categoryId, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      queryClient.removeQueries({
        queryKey: ["products-detail"],
      });
    },
    [queryClient, selectedCategoryId, selectedInsuranceId]
  );

  return {
    handleSubmit,
    control,
    errors,
    reset,
    setValue,
    watch,

    categories,
    insurances,
    productFields,

    selectedCategoryId,
    selectedInsuranceId,

    hasAccess,
    showAlert,
    alertMessage,
    alertType,
    isEdit,

    isLoadingCategories,
    isLoadingInsurances,
    isLoadingProducts,
    isSaving: createProductMutation.isPending || updateProductMutation.isPending,

    handleSave,
    handleAddProduct,
    handleChangeProduct,
    handleDeleteProduct,
    setShowAlert,
    goBack,
    loadProductDetail,
  };
}

