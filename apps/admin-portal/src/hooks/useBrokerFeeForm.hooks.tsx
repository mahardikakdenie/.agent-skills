import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { useProducts } from "@/app/product-category/hooks";
import AppURL from "@/constants/app-url.const";
import { useBrokerFeeDetail } from "@/services/finance/hooks/queries";
import {
  useCreateBrokerFee,
  useUpdateBrokerFee,
} from "@/services/finance/hooks/mutations";

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

  const { data: brokerFeeDetailResponse, isLoading: isLoadingDetail } =
    useBrokerFeeDetail(brokerFeeId, {
      enabled: isEdit && !!brokerFeeId,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    });

  const brokerFeeDetail = useMemo(() => {
    if (!brokerFeeDetailResponse) return null;

    const detail = (brokerFeeDetailResponse as any)?.data;
    if (Array.isArray(detail)) {
      return detail[0] ?? null;
    }

    return detail ?? brokerFeeDetailResponse ?? null;
  }, [brokerFeeDetailResponse]);

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

  const handleSaveSuccess = useCallback(
    (data: any) => {
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
        router.push(AppURL.financeBrokerFee);
      }, 2000);
    },
    [isEdit, router]
  );

  const handleSaveError = useCallback(
    (error: unknown) => {
      console.error("Failed to save broker fee:", error);
      setErrorMessage(
        isEdit
          ? "Failed to update broker fee. Please try again."
          : "Failed to create broker fee. Please try again."
      );
      setShowAlert(true);
    },
    [isEdit]
  );

  const createBrokerFeeMutation = useCreateBrokerFee({
    onSuccess: handleSaveSuccess,
    onError: handleSaveError,
  });

  const updateBrokerFeeMutation = useUpdateBrokerFee({
    onSuccess: handleSaveSuccess,
    onError: (error) => {
      handleSaveError(error);
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

      if (isEdit && brokerFeeId) {
        updateBrokerFeeMutation.mutate({ id: brokerFeeId, payload });
        return;
      }

      createBrokerFeeMutation.mutate(payload);
    },
    [
      isEdit,
      brokerFeeId,
      createBrokerFeeMutation,
      updateBrokerFeeMutation,
      insurances,
      products,
      plans,
    ]
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
    isSaving:
      createBrokerFeeMutation.isPending || updateBrokerFeeMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadBrokerFeeDetail,
  };
}
