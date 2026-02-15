import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";
import { useAccountDetail } from "@/services/auth/hooks/queries";
import { useChannelsV1 } from "@/services/channel/hooks/queries";
import {
  useCreateAccount,
  useUpdateAccount,
} from "@/services/auth/hooks/mutations";

interface PartnerFormData {
  name: string;
  email: string;
  phone_number: string;
  api_key: string;
  channel: string;
  phone_code: string;
}

interface UsePartnerManagementFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;

  partnerId?: string;
  partnerName: string;
  partnerEmail: string;
  channels: any[];

  isLoadingDetail: boolean;
  isLoadingChannels: boolean;
  isSaving: boolean;

  handleSave: (formData: PartnerFormData) => Promise<void>;
  loadPartnerDetail: (id: string) => void;
  generateApiKey: () => void;
  goBack: () => void;
}

export function usePartnerManagementForm(
  mode: "create" | "edit" = "create",
): UsePartnerManagementFormProps {
  const router = useRouter();

  const [partnerId, setPartnerId] = useState<string>();
  const isEdit = mode === "edit";

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PartnerFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      api_key: "",
      channel: "",
      phone_code: "+62",
    },
  });

  const { data: partnerDetail, isLoading: isLoadingDetail } = useAccountDetail(
    partnerId ?? "",
    {
      enabled: !!partnerId && isEdit,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    }
  );

  const { data: channelsResponse, isLoading: isLoadingChannels } = useChannelsV1(
    {
      page: 1,
      limit: 9999,
    },
    {
      staleTime: 300000,
    }
  );

  const channelsData = (channelsResponse as any)?.data || [];

  const createAccountMutation = useCreateAccount({
    onSuccess: (response: any) => {
      toast.success(
        isEdit
          ? "Partner Updated Successfully!"
          : "Partner Created Successfully!",
      );

      const createdId = response?.id || response?.data?.id;
      if (!isEdit && createdId) {
        router.push(
          `${AppURL.masterdataPartnerManagementDetail}/${createdId}`,
        );
      }
    },
    onError: (error: any) => {
      console.error("Save failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save partner. Please try again.",
      );
    },
  });

  const updateAccountMutation = useUpdateAccount({
    onSuccess: (response: any) => {
      toast.success(
        isEdit
          ? "Partner Updated Successfully!"
          : "Partner Created Successfully!",
      );

      const createdId = response?.id || response?.data?.id;
      if (!isEdit && createdId) {
        router.push(
          `${AppURL.masterdataPartnerManagementDetail}/${createdId}`,
        );
      }
    },
    onError: (error: any) => {
      console.error("Save failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save partner. Please try again.",
      );
    },
  });

  useEffect(() => {
    if (partnerDetail && isEdit) {
      const partnerData: any = partnerDetail;
      const phoneMatch = partnerData.phone_number?.match(/^(\+\d{2})(.*)$/);

      reset({
        name: partnerData.name || "",
        email: partnerData.email || "",
        phone_code: phoneMatch?.[1] || "+62",
        phone_number: phoneMatch?.[2] || partnerData.phone_number || "",
        api_key: partnerData.api_key || "",
        channel: partnerData.channel?.toString() || "",
      });
    }
  }, [partnerDetail, reset, isEdit]);

  const handleSave = useCallback(
    async (formData: PartnerFormData) => {
      if (!formData.name || !formData.email) {
        toast.error("Name and email are required");
        return;
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_code + formData.phone_number,
        api_key: formData.api_key,
        channel: formData.channel,
        role: "Partner",
      };

      if (isEdit && partnerId) {
        await updateAccountMutation.mutateAsync({ id: partnerId, payload });
        return;
      }

      await createAccountMutation.mutateAsync(payload);
    },
    [isEdit, partnerId, createAccountMutation, updateAccountMutation],
  );

  const loadPartnerDetail = useCallback((id: string) => {
    setPartnerId(id);
  }, []);

  const generateApiKey = useCallback(() => {
    const apiKey =
      "key_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setValue("api_key", apiKey);
  }, [setValue]);

  const goBack = useCallback(() => {
    router.push(AppURL.masterdataPartnerManagement);
  }, [router]);

  return {
    handleSubmit,
    control,
    errors,
    setValue,
    watch,
    partnerId,
    partnerName: watch("name"),
    partnerEmail: watch("email"),
    channels: channelsData || [],
    isLoadingDetail,
    isLoadingChannels,
    isSaving: createAccountMutation.isPending || updateAccountMutation.isPending,
    handleSave,
    loadPartnerDetail,
    generateApiKey,
    goBack,
  };
}
