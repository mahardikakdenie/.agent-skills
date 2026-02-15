import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import AppURL from "@/constants/app-url.const";
import { useChannelDetailV1 } from "@/services/channel/hooks/queries";
import {
  useCreateChannel,
  useUpdateChannel,
} from "@/services/channel/hooks/mutations";

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

  const { data: channelDetailResponse, isLoading: isLoadingDetail } =
    useChannelDetailV1(channelId, {
      enabled: isEdit && !!channelId,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    });

  const channelDetail: any = channelDetailResponse
    ? (channelDetailResponse as any)?.data ?? channelDetailResponse
    : null;

  useEffect(() => {
    if (channelDetail && isEdit) {
      reset({
        name: channelDetail.name || "",
        type: channelDetail.type || "",
      });
    }
  }, [channelDetail, reset, isEdit]);

  const handleSaveSuccess = useCallback(() => {
    setAlertType("success");
    setAlertMessage(
      isEdit
        ? "Channel Updated Successfully!"
        : "Channel Created Successfully!"
    );
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      router.back();
    }, 2000);
  }, [isEdit, router]);

  const handleSaveError = useCallback((error: unknown) => {
    console.error("Failed to save channel:", error);
    setAlertType("error");
    setAlertMessage("Failed to save channel. Please try again.");
    setShowAlert(true);
  }, []);

  const createChannelMutation = useCreateChannel({
    onSuccess: () => {
      handleSaveSuccess();
    },
    onError: handleSaveError,
  });

  const updateChannelMutation = useUpdateChannel({
    onSuccess: () => {
      handleSaveSuccess();
    },
    onError: handleSaveError,
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

      if (isEdit) {
        updateChannelMutation.mutate({ id: channelId, payload: formData });
        return;
      }

      createChannelMutation.mutate(formData);
    },
    [
      isEdit,
      channelId,
      createChannelMutation,
      updateChannelMutation,
      setAlertMessage,
      setShowAlert,
      setAlertType,
    ]
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
    isSaving: createChannelMutation.isPending || updateChannelMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadChannelDetail,
  };
}
