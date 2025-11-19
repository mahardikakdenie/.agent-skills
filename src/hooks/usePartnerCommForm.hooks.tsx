import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { financeService } from "@/services/api.service";
import { useProducts } from "@/app/product-category/hooks";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";

interface PartnerCommFormData {
  channel: string;
  insurance: string;
  product?: string;
  plan?: string;
  fee: number;
}

interface UsePartnerCommFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;
  setValue: any;
  watch: any;

  channels: any[];
  insurances: any[];
  products: any[];
  plans: any[];

  hasAccess: boolean | null;
  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;

  isLoadingChannels: boolean;
  isLoadingInsurances: boolean;
  isLoadingProducts: boolean;
  isLoadingPlans: boolean;
  isLoadingDetail: boolean;
  isSaving: boolean;

  handleSave: (formData: PartnerCommFormData) => void;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
  loadPartnerCommDetail: (id: string) => void;
}

export function usePartnerCommForm(
  mode: "create" | "edit" = "create"
): UsePartnerCommFormProps {
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
  } = useForm<PartnerCommFormData>({
    shouldUnregister: false,
    defaultValues: {
      channel: "",
      insurance: "All",
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
  const [partnerCommId, setPartnerCommId] = useState<string>("");

  const initializationStep = useRef<
    "idle" | "channels" | "insurances" | "complete"
  >("idle");

  const watchChannel = watch("channel");
  const watchInsurance = watch("insurance");

  useEffect(() => {
    const checkAccess = async () => {
      const requiredPermission = isEdit
        ? "Finance.Partner Comm.Update"
        : "Finance.Partner Comm.Create";
      const access = permissionList.includes(requiredPermission);
      setHasAccess(access);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList, isEdit]);

  const { data: channelsData, isLoading: isLoadingChannels } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const response = await financeService.get(ApiURL.v1Channels, {
        params: { page: 1, limit: 100 },
      });
      return response.data.data || [];
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (watchChannel && initializationStep.current === "complete") {
      fetchInsurances({ channelId: watchChannel });
      setValue("insurance", "All");
    }
  }, [watchChannel, fetchInsurances, setValue]);

  const { data: partnerCommDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["partner-comm-detail", partnerCommId],
    queryFn: async () => {
      if (!partnerCommId) return null;

      const response = await financeService.get(ApiURL.v1FeesChannel, {
        params: { id: partnerCommId },
      });
      return response.data.data[0];
    },
    enabled: isEdit && !!partnerCommId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (!partnerCommDetail || !isEdit) {
      return;
    }

    if (
      initializationStep.current === "idle" &&
      channelsData &&
      channelsData.length > 0
    ) {
      setValue("channel", partnerCommDetail.channel);
      setValue("fee", Number(partnerCommDetail.fee) || 0);

      fetchInsurances({ channelId: partnerCommDetail.channel });
      initializationStep.current = "channels";
      return;
    }

    if (initializationStep.current === "channels" && insurances.length > 0) {
      setValue(
        "insurance",
        partnerCommDetail.insurance ? partnerCommDetail.insurance : "All"
      );
      initializationStep.current = "complete";
      return;
    }
  }, [
    partnerCommDetail,
    isEdit,
    channelsData,
    insurances,
    setValue,
    fetchInsurances,
  ]);

  useEffect(() => {
    initializationStep.current = "idle";
    reset({
      channel: "",
      insurance: "All",
      product: "",
      plan: "",
      fee: 0,
    });

    if (partnerCommId) {
      queryClient.removeQueries({
        queryKey: ["partner-comm-detail", partnerCommId],
      });
    }
  }, [partnerCommId, reset, queryClient]);

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (isEdit && partnerCommId) {
        const response = await financeService.put(
          ApiURL.v1FeesChannelDetail(partnerCommId),
          payload
        );
        return response.data;
      } else {
        const response = await financeService.post(
          ApiURL.v1FeesChannelDetail(payload.channel),
          payload
        );
        return response.data;
      }
    },
    onSuccess: (data) => {
      if (data != null) {
        setErrorMessage(
          isEdit
            ? "Partner Comm Updated Successfully!"
            : "Partner Comm Created Successfully!"
        );
      } else {
        setErrorMessage(
          isEdit
            ? "Failed to update partner comm. Please try again."
            : "Failed to create partner comm. Please try again."
        );
      }

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        queryClient.invalidateQueries({ queryKey: ["partner-comms"] });
        queryClient.removeQueries({ queryKey: ["partner-comm-detail"] });
        router.push(AppURL.financePartnerComm);
      }, 2000);
    },
    onError: (error) => {
      console.error("Failed to save partner comm:", error);
      setErrorMessage(
        isEdit
          ? "Failed to update partner comm. Please try again."
          : "Failed to create partner comm. Please try again."
      );
      setShowAlert(true);
    },
  });

  const handleSave = useCallback(
    async (formData: PartnerCommFormData) => {
      setErrorMessage("");
      setShowAlert(false);

      const requiredFields = ["channel", "insurance", "fee"];

      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof PartnerCommFormData]
      );

      if (missingFields.length > 0) {
        setErrorMessage("Please fill in all required fields.");
        setShowAlert(true);
        return;
      }

      const payload = {
        channel: formData.channel,
        channel_name:
          channelsData?.find((c: any) => c.id === formData.channel)?.name || "",
        insurance: formData.insurance === "All" ? null : formData.insurance,
        insurance_name:
          insurances.find((i: any) => i.id === formData.insurance)?.name || "",
        product: formData.product || null,
        plan: formData.plan || null,
        fee: formData.fee,
        fee_type: "percentage",
        currency: "IDR",
      };

      saveMutation.mutate(payload);
    },
    [saveMutation, channelsData, insurances]
  );

  const goBack = useCallback(() => {
    router.push(AppURL.financePartnerComm);
  }, [router]);

  const loadPartnerCommDetail = useCallback((id: string) => {
    setPartnerCommId(id);
  }, []);

  return {
    handleSubmit,
    control,
    errors,
    reset,
    setValue,
    watch,

    channels: channelsData || [],
    insurances,
    products,
    plans,

    hasAccess,
    showAlert,
    errorMessage,
    isEdit,

    isLoadingChannels,
    isLoadingInsurances,
    isLoadingProducts,
    isLoadingPlans: isLoadingAllPlans,
    isLoadingDetail,
    isSaving: saveMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadPartnerCommDetail,
  };
}
