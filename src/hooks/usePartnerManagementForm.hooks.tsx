import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserService } from "@/services/masterdata/user.service";
import { ChannelService } from "@/services/channel.services";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";

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
  const queryClient = useQueryClient();
  const userService = new UserService();
  const channelService = new ChannelService();

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

  const { data: partnerDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["partner-detail", partnerId],
    queryFn: async () => {
      if (!partnerId) return null;
      const response = await userService.getUserById(partnerId);
      return response;
    },
    enabled: !!partnerId && isEdit,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const { data: channelsData, isLoading: isLoadingChannels } = useQuery({
    queryKey: ["channels-list"],
    queryFn: async () => {
      const response = await channelService.getChannels(1, 9999);
      return response.data || [];
    },
    staleTime: 300000,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: PartnerFormData) => {
      const payload = {
        name: data.name,
        email: data.email,
        phone_number: data.phone_code + data.phone_number,
        api_key: data.api_key,
        channel: data.channel,
        role: "Partner",
      };

      if (isEdit && partnerId) {
        return await userService.updateUser(payload, partnerId);
      } else {
        return await userService.saveUser(payload);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      queryClient.invalidateQueries({ queryKey: ["partner-detail"] });

      toast.success(
        isEdit
          ? "Partner Updated Successfully!"
          : "Partner Created Successfully!",
      );

      if (!isEdit && response?.id) {
        router.push(
          `${AppURL.masterdataPartnerManagementDetail}/${response.id}`,
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
      const phoneMatch = partnerDetail.phone_number?.match(/^(\+\d{2})(.*)$/);

      reset({
        name: partnerDetail.name || "",
        email: partnerDetail.email || "",
        phone_code: phoneMatch?.[1] || "+62",
        phone_number: phoneMatch?.[2] || partnerDetail.phone_number || "",
        api_key: partnerDetail.api_key || "",
        channel: partnerDetail.channel?.toString() || "",
      });
    }
  }, [partnerDetail, reset, isEdit]);

  const handleSave = useCallback(
    async (formData: PartnerFormData) => {
      if (!formData.name || !formData.email) {
        toast.error("Name and email are required");
        return;
      }

      await saveMutation.mutateAsync(formData);
    },
    [saveMutation],
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
    isSaving: saveMutation.isPending,
    handleSave,
    loadPartnerDetail,
    generateApiKey,
    goBack,
  };
}
