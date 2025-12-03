import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { MdProductService } from "@/services/masterdata/product.service";
import { productService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";

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
  const mdProductService = new MdProductService();
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

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const result = await mdProductService.getCategories();
      return result;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const { data: insurances = [], isLoading: isLoadingInsurances } = useQuery({
    queryKey: ["product-insurances", selectedCategoryId],
    queryFn: async () => {
      if (!selectedCategoryId) return [];

      const response: any = await productService.get(ApiURL.v1Insurances, {
        params: { page: 1, categoryId: selectedCategoryId },
      });
      return response?.data?.data || [];
    },
    enabled: !!selectedCategoryId,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const { data: existingProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products-detail", selectedCategoryId, selectedInsuranceId],
    queryFn: async () => {
      if (!selectedCategoryId || !selectedInsuranceId) return [];

      const { data } = await mdProductService.getProduct(
        1,
        100,
        "",
        selectedCategoryId,
        selectedInsuranceId
      );
      return data;
    },
    enabled: isEdit && !!selectedCategoryId && !!selectedInsuranceId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

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

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      products: ProductField[];
      category: string;
      insurance: string;
    }) => {
      const results = [];

      for (const product of payload.products) {
        if (product.id === "") {
          const { data } = await mdProductService.saveProduct({
            category: payload.category,
            insurance: payload.insurance,
            name: product.name,
          });
          results.push(data);
        } else {
          const { data } = await mdProductService.updateProduct(
            {
              category: payload.category,
              insurance: payload.insurance,
              name: product.name,
            },
            product.id
          );
          results.push(data);
        }
      }

      return results;
    },
    onSuccess: () => {
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
    },
    onError: (error) => {
      console.error("Failed to save products:", error);
      setAlertType("error");
      setAlertMessage("Failed to save products. Please try again.");
      setShowAlert(true);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await mdProductService.deleteProduct(id);
    },
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

      saveMutation.mutate({
        products: validProducts,
        category: formData.category,
        insurance: formData.insurance,
      });
    },
    [saveMutation, productFields]
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
    isSaving: saveMutation.isPending,

    handleSave,
    handleAddProduct,
    handleChangeProduct,
    handleDeleteProduct,
    setShowAlert,
    goBack,
    loadProductDetail,
  };
}
