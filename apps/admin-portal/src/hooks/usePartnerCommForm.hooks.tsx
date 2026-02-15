import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { useProducts } from "@/app/product-category/hooks";
import AppURL from "@/constants/app-url.const";
import { useChannelsV1 } from "@/services/channel/hooks/queries";
import { useChannelFeeDetail } from "@/services/finance/hooks/queries";
import {
  useCreateChannelFee,
  useUpdateChannelFee,
} from "@/services/finance/hooks/mutations";

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

  const { data: channelsResponse, isLoading: isLoadingChannels } = useChannelsV1(
    {
      page: 1,
      limit: 100,
    },
    {
      staleTime: 300000,
      refetchOnWindowFocus: false,
    }
  );
  const channelsData = (channelsResponse as any)?.data || [];

  useEffect(() => {
    if (watchChannel && initializationStep.current === "complete") {
      fetchInsurances({ channelId: watchChannel });
      setValue("insurance", "All");
    }
  }, [watchChannel, fetchInsurances, setValue]);

  const { data: partnerCommDetailResponse, isLoading: isLoadingDetail } =
    useChannelFeeDetail(partnerCommId, {
      enabled: isEdit && !!partnerCommId,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    });

  const partnerCommDetail = (() => {
    const detail = (partnerCommDetailResponse as any)?.data;
    if (Array.isArray(detail)) {
      return detail[0] ?? null;
    }

    return detail ?? partnerCommDetailResponse ?? null;
  })();

  useEffect(() => {
    const detail = partnerCommDetail;

    if (!detail || !isEdit) {
      return;
    }

    if (
      initializationStep.current === "idle" &&
      channelsData &&
      channelsData.length > 0
    ) {
      setValue("channel", detail.channel);
      setValue("fee", Number(detail.fee) || 0);

      fetchInsurances({ channelId: detail.channel });
      initializationStep.current = "channels";
      return;
    }

    if (initializationStep.current === "channels" && insurances.length > 0) {
      setValue(
        "insurance",
        detail.insurance ? detail.insurance : "All"
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
  }, [partnerCommId, reset]);

  const handleSaveSuccess = useCallback(
    (data: unknown) => {
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
        router.push(AppURL.financePartnerComm);
      }, 2000);
    },
    [isEdit, router]
  );

  const handleSaveError = useCallback(
    (error: any) => {
      const defaultMessage = isEdit
        ? "Failed to update partner comm. Please try again."
        : "Failed to create partner comm. Please try again.";
      const errorMessage = error?.response?.data?.message || defaultMessage;
      setErrorMessage(errorMessage);
      setShowAlert(true);
    },
    [isEdit]
  );

  const createChannelFeeMutation = useCreateChannelFee({
    onSuccess: handleSaveSuccess,
    onError: handleSaveError,
  });

  const updateChannelFeeMutation = useUpdateChannelFee({
    onSuccess: handleSaveSuccess,
    onError: (error: any) => {
      handleSaveError(error);
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

      if (isEdit && partnerCommId) {
        updateChannelFeeMutation.mutate({ channelId: partnerCommId, payload });
        return;
      }

      createChannelFeeMutation.mutate({
        channelId: payload.channel,
        payload,
      });
    },
    [
      isEdit,
      partnerCommId,
      createChannelFeeMutation,
      updateChannelFeeMutation,
      channelsData,
      insurances,
    ]
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
    isSaving:
      createChannelFeeMutation.isPending || updateChannelFeeMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadPartnerCommDetail,
  };
}
