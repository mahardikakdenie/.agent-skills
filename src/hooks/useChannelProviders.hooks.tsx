import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth.context";
import { CommunicationService } from "@/services/communication.service";
import { channelService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import { toastNotification } from "@/lib/toast";

interface ChannelProvider {
  id: string;
  channelId: string;
  type: string;
  provider: string;
  fromEmail?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Channel {
  id: string;
  name: string;
  [key: string]: any;
}

interface ChannelProviderFormData {
  channelId: string;
  type: string;
  provider: string;
  fromEmail?: string;
  enabled: boolean;
}

export function useChannelProviders() {
  const { handleResponseError } = useAuth();
  const queryClient = useQueryClient();

  const [filterType, setFilterType] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ChannelProvider | null>(
    null
  );
  const [disablingProvider, setDisablingProvider] =
    useState<ChannelProvider | null>(null);
  const [deletingProvider, setDeletingProvider] =
    useState<ChannelProvider | null>(null);

  // Form state
  const [formData, setFormData] = useState<ChannelProviderFormData>({
    channelId: "",
    type: "",
    provider: "",
    fromEmail: "",
    enabled: true,
  });

  const resetForm = useCallback(() => {
    setFormData({
      channelId: "",
      type: "",
      provider: "",
      fromEmail: "",
      enabled: true,
    });
  }, []);

  // Fetch channel providers
  const {
    data: providersResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["channel-providers", filterType],
    queryFn: async () => {
      const res: any = await CommunicationService.getChannelProviders(
        filterType || undefined
      );
      return res.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  // Fetch channels for dropdown
  const { data: channelsResponse } = useQuery({
    queryKey: ["channels-list"],
    queryFn: async () => {
      const res: any = await channelService.get(ApiURL.v1Channels, {
        params: { page: 1, limit: 1000 },
      });
      return res.data;
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Fetch available providers based on selected type
  const { data: availableProvidersResponse } = useQuery({
    queryKey: ["available-providers", formData.type],
    queryFn: async () => {
      const res: any = await CommunicationService.getAvailableProviders(
        formData.type
      );
      return res.data;
    },
    enabled: !!formData.type,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: ChannelProviderFormData) =>
      CommunicationService.createChannelProvider(data),
    onSuccess: () => {
      toastNotification("Channel provider created successfully");
      queryClient.invalidateQueries({ queryKey: ["channel-providers"] });
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create channel provider";
      toastNotification(message, "error");
      handleResponseError(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { provider?: string; fromEmail?: string; enabled?: boolean };
    }) => CommunicationService.updateChannelProvider(id, data),
    onSuccess: () => {
      toastNotification("Channel provider updated successfully");
      queryClient.invalidateQueries({ queryKey: ["channel-providers"] });
      setEditingProvider(null);
      resetForm();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update channel provider";
      toastNotification(message, "error");
      handleResponseError(error);
    },
  });

  const disableMutation = useMutation({
    mutationFn: (id: string) =>
      CommunicationService.updateChannelProvider(id, {
        enabled: false,
      }),
    onSuccess: () => {
      toastNotification("Channel provider disabled successfully");
      queryClient.invalidateQueries({ queryKey: ["channel-providers"] });
      setDisablingProvider(null);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to disable channel provider";
      toastNotification(message, "error");
      handleResponseError(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CommunicationService.deleteChannelProvider(id),
    onSuccess: () => {
      toastNotification("Channel provider deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["channel-providers"] });
      setDeletingProvider(null);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete channel provider";
      toastNotification(message, "error");
      handleResponseError(error);
    },
  });

  const openCreate = useCallback(() => {
    resetForm();
    setIsCreateOpen(true);
  }, [resetForm]);

  const openEdit = useCallback(
    (provider: ChannelProvider) => {
      setFormData({
        channelId: provider.channelId,
        type: provider.type,
        provider: provider.provider,
        fromEmail: provider.fromEmail || "",
        enabled: provider.enabled,
      });
      setEditingProvider(provider);
    },
    []
  );

  const handleCreate = useCallback(() => {
    const payload: ChannelProviderFormData = {
      channelId: formData.channelId,
      type: formData.type,
      provider: formData.provider,
      enabled: formData.enabled,
    };
    if (formData.type === "email" && formData.fromEmail) {
      payload.fromEmail = formData.fromEmail;
    }
    createMutation.mutate(payload);
  }, [formData, createMutation]);

  const handleUpdate = useCallback(() => {
    if (!editingProvider) return;
    const payload: { provider?: string; fromEmail?: string; enabled?: boolean } =
      {
        provider: formData.provider,
        enabled: formData.enabled,
      };
    if (editingProvider.type === "email") {
      payload.fromEmail = formData.fromEmail;
    }
    updateMutation.mutate({
      id: editingProvider.id,
      data: payload,
    });
  }, [editingProvider, formData, updateMutation]);

  const handleDisable = useCallback(() => {
    if (!disablingProvider) return;
    disableMutation.mutate(disablingProvider.id);
  }, [disablingProvider, disableMutation]);

  const handleDelete = useCallback(() => {
    if (!deletingProvider) return;
    deleteMutation.mutate(deletingProvider.id);
  }, [deletingProvider, deleteMutation]);

  // Reset provider dropdown when type changes in create mode
  useEffect(() => {
    if (isCreateOpen) {
      setFormData((prev) => ({ ...prev, provider: "" }));
    }
  }, [formData.type, isCreateOpen]);

  const providers: ChannelProvider[] = Array.isArray(providersResponse)
    ? providersResponse
    : providersResponse?.data || [];

  const channels: Channel[] = Array.isArray(channelsResponse)
    ? channelsResponse
    : channelsResponse?.data || [];

  const availableProviders: string[] = Array.isArray(
    availableProvidersResponse
  )
    ? availableProvidersResponse
    : availableProvidersResponse?.data || [];

  return {
    providers,
    channels,
    availableProviders,
    isLoading,
    filterType,
    setFilterType,
    isCreateOpen,
    setIsCreateOpen,
    editingProvider,
    setEditingProvider,
    disablingProvider,
    setDisablingProvider,
    deletingProvider,
    setDeletingProvider,
    formData,
    setFormData,
    openCreate,
    openEdit,
    handleCreate,
    handleUpdate,
    handleDisable,
    handleDelete,
    resetForm,
    refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDisabling: disableMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
