import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { channelService } from "@/services/channel/api/channel.service";
import AppURL from "@/constants/app-url.const";

interface ChannelFormData {
  name: string;
  type: string;
}

interface UseChannelFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;
  setValue: any;
  watch: any;

  channelId: string;

  hasAccess: boolean | null;
  showAlert: boolean;
  alertMessage: string;
  alertType: "success" | "error";
  isEdit: boolean;

  isLoadingDetail: boolean;
  isSaving: boolean;

  handleSave: (formData: ChannelFormData) => void;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
  loadChannelDetail: (id: string) => void;
}

export function useChannelForm(
  mode: "create" | "edit" = "create"
): UseChannelFormProps {
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
  } = useForm<ChannelFormData>({
    shouldUnregister: false,
    defaultValues: {
      name: "",
      type: "",
    },
  });

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [channelId, setChannelId] = useState<string>("");

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

  const { data: channelDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["channel-detail", channelId],
    queryFn: async () => {
      if (!channelId) return null;

      const response: any = await channelService.getChannelByIdV1(channelId);
      return response?.data ?? response;
    },
    enabled: isEdit && !!channelId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (channelDetail && isEdit) {
      reset({
        name: channelDetail.name || "",
        type: channelDetail.type || "",
      });
    }
  }, [channelDetail, reset, isEdit]);

  const saveMutation = useMutation({
    mutationFn: async (payload: ChannelFormData) => {
      if (isEdit) {
        const data: any = await channelService.updateChannel(channelId, payload);
        return data?.data ?? data;
      } else {
        const data: any = await channelService.createChannel(payload);
        return data?.data ?? data;
      }
    },
    onSuccess: () => {
      setAlertType("success");
      setAlertMessage(
        isEdit
          ? "Channel Updated Successfully!"
          : "Channel Created Successfully!"
      );
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        queryClient.invalidateQueries({ queryKey: ["channels"] });
        queryClient.removeQueries({ queryKey: ["channel-detail"] });
        router.back();
      }, 2000);
    },
    onError: (error) => {
      console.error("Failed to save channel:", error);
      setAlertType("error");
      setAlertMessage("Failed to save channel. Please try again.");
      setShowAlert(true);
    },
  });

  const handleSave = useCallback(
    async (formData: ChannelFormData) => {
      setAlertMessage("");
      setShowAlert(false);

      if (!formData.name || !formData.type) {
        setAlertType("error");
        setAlertMessage("Please fill in all required fields.");
        setShowAlert(true);
        return;
      }

      saveMutation.mutate(formData);
    },
    [saveMutation]
  );

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const loadChannelDetail = useCallback((id: string) => {
    setChannelId(id);
  }, []);

  return {
    handleSubmit,
    control,
    errors,
    reset,
    setValue,
    watch,

    channelId,

    hasAccess,
    showAlert,
    alertMessage,
    alertType,
    isEdit,

    isLoadingDetail,
    isSaving: saveMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadChannelDetail,
  };
}
