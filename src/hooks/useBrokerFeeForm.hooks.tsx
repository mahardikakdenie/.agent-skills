import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { financeService } from "@/services/api.service";
import { useProducts } from "@/app/product-category/hooks";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";

interface BrokerFeeFormData {
  insurance: string;
  product: string;
  plan: string;
  fee: number;
}

interface UseBrokerFeeFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;
  setValue: any;
  watch: any;

  insurances: any[];
  products: any[];
  plans: any[];

  hasAccess: boolean | null;
  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;

  isLoadingInsurances: boolean;
  isLoadingProducts: boolean;
  isLoadingPlans: boolean;
  isLoadingDetail: boolean;
  isSaving: boolean;

  handleSave: (formData: BrokerFeeFormData) => void;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
  loadBrokerFeeDetail: (id: string) => void;
}

export function useBrokerFeeForm(
  mode: "create" | "edit" = "create"
): UseBrokerFeeFormProps {
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
  } = useForm<BrokerFeeFormData>({
    shouldUnregister: false,
    defaultValues: {
      insurance: "",
      product: "",
      plan: "",
      fee: 0,
    },
  });

  const {
    insurances,
    products,
    plans,
    fetchInsurances,
    fetchProducts,
    fetchPlans,
    isLoadingInsurances,
    isLoadingProducts,
    isLoadingAllPlans,
  } = useProducts();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [brokerFeeId, setBrokerFeeId] = useState<string>("");

  const initializationStep = useRef<
    "idle" | "insurances" | "products" | "plans" | "complete"
  >("idle");

  const watchInsurance = watch("insurance");
  const watchProduct = watch("product");

  useEffect(() => {
    const checkAccess = async () => {
      const requiredPermission = isEdit
        ? "Finance.Broker Fee.Update"
        : "Finance.Broker Fee.Create";
      const access = permissionList.includes(requiredPermission);
      setHasAccess(access);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList, isEdit]);

  useEffect(() => {
    fetchInsurances({});
  }, [fetchInsurances]);

  useEffect(() => {
    if (watchInsurance && initializationStep.current === "complete") {
      fetchProducts({ insuranceId: watchInsurance });
    }
  }, [watchInsurance, fetchProducts]);

  useEffect(() => {
    if (watchProduct && initializationStep.current === "complete") {
      fetchPlans({ productId: watchProduct });
    }
  }, [watchProduct, fetchPlans]);

  const { data: brokerFeeDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["broker-fee-detail", brokerFeeId],
    queryFn: async () => {
      if (!brokerFeeId) return null;

      const response = await financeService.get(ApiURL.v1FeesBroker, {
        params: { id: brokerFeeId },
      });
      return response.data.data[0];
    },
    enabled: isEdit && !!brokerFeeId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (!brokerFeeDetail || !isEdit) {
      return;
    }

    if (initializationStep.current === "idle" && insurances.length > 0) {
      setValue("insurance", brokerFeeDetail.insurance);
      setValue("fee", Number(brokerFeeDetail.fee) || 0);

      if (brokerFeeDetail.product) {
        fetchProducts({ insuranceId: brokerFeeDetail.insurance });
        initializationStep.current = "insurances";
      } else {
        initializationStep.current = "complete";
      }
      return;
    }

    if (initializationStep.current === "insurances" && products.length > 0) {
      setValue("product", brokerFeeDetail.product);

      if (brokerFeeDetail.plan) {
        fetchPlans({ productId: brokerFeeDetail.product });
        initializationStep.current = "products";
      } else {
        initializationStep.current = "complete";
      }
      return;
    }

    if (initializationStep.current === "products" && plans.length > 0) {
      setValue("plan", brokerFeeDetail.plan);
      initializationStep.current = "complete";
      return;
    }
  }, [
    brokerFeeDetail,
    isEdit,
    insurances,
    products,
    plans,
    setValue,
    fetchProducts,
    fetchPlans,
  ]);

  useEffect(() => {
    initializationStep.current = "idle";
  }, [brokerFeeId]);

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (isEdit && brokerFeeId) {
        const response = await financeService.put(
          ApiURL.v1FeesBrokerDetail(brokerFeeId),
          payload
        );
        return response.data;
      } else {
        const response = await financeService.post(
          ApiURL.v1FeesBroker,
          payload
        );
        return response.data;
      }
    },
    onSuccess: (data) => {
      if (data != null) {
        setErrorMessage(
          isEdit
            ? "Broker Fee Updated Successfully!"
            : "Broker Fee Created Successfully!"
        );
      } else {
        setErrorMessage(
          isEdit
            ? "Failed to update broker fee. Please try again."
            : "Failed to create broker fee. Please try again."
        );
      }

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        queryClient.invalidateQueries({ queryKey: ["broker-fees"] });
        router.push(AppURL.financeBrokerFee);
      }, 2000);
    },
    onError: (error) => {
      console.error("Failed to save broker fee:", error);
      setErrorMessage(
        isEdit
          ? "Failed to update broker fee. Please try again."
          : "Failed to create broker fee. Please try again."
      );
      setShowAlert(true);
    },
  });

  const handleSave = useCallback(
    async (formData: BrokerFeeFormData) => {
      setErrorMessage("");
      setShowAlert(false);

      const requiredFields = ["insurance", "fee"];

      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof BrokerFeeFormData]
      );

      if (missingFields.length > 0) {
        setErrorMessage("Please fill in all required fields.");
        setShowAlert(true);
        return;
      }

      const payload = {
        ...formData,
        product: formData.product || null,
        plan: formData.plan || null,
        insurance_name:
          insurances.find((i: any) => i.id === formData.insurance)?.name || "",
        product_name:
          products.find((i: any) => i.id === formData.product)?.name || "",
        plan_name: plans.find((i: any) => i.id === formData.plan)?.name || "",
        broker: "40eee5bf-2b92-4d23-be55-f9caa9d3ea88",
        fee_type: "percentage",
        currency: "IDR",
      };

      saveMutation.mutate(payload);
    },
    [saveMutation, insurances, products, plans]
  );

  const goBack = useCallback(() => {
    router.push(AppURL.financeBrokerFee);
  }, [router]);

  const loadBrokerFeeDetail = useCallback((id: string) => {
    setBrokerFeeId(id);
  }, []);

  return {
    handleSubmit,
    control,
    errors,
    reset,
    setValue,
    watch,

    insurances,
    products,
    plans,

    hasAccess,
    showAlert,
    errorMessage,
    isEdit,

    isLoadingInsurances,
    isLoadingProducts,
    isLoadingPlans: isLoadingAllPlans,
    isLoadingDetail,
    isSaving: saveMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadBrokerFeeDetail,
  };
}
