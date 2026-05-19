import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth.context";
import { toastNotification } from "@/lib/toast";
import { useChannelsV1 } from "@/services/channel/hooks/queries";
import {
  useAvailableProviders,
  useChannelProvidersQuery,
} from "@/services/communication/hooks/queries";
import {
  useCreateChannelProvider,
  useDeleteChannelProvider,
  useUpdateChannelProvider,
} from "@/services/communication/hooks/mutations";

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
  } = useChannelProvidersQuery(filterType ? { type: filterType } : undefined, {
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  // Fetch channels for dropdown
  const { data: channelsResponse } = useChannelsV1({
    page: 1,
    limit: 1000,
  }, {
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Fetch available providers based on selected type
  const { data: availableProvidersResponse } = useAvailableProviders({
    type: formData.type,
  }, {
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useCreateChannelProvider({
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

  const updateMutation = useUpdateChannelProvider({
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

  const disableMutation = useUpdateChannelProvider({
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

  const deleteMutation = useDeleteChannelProvider({
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
    const payload: ChannelProviderFormData = {
      channelId: formData.channelId,
      type: formData.type,
      provider: formData.provider,
      enabled: formData.enabled,
    };
    if (formData.type === "email" && formData.fromEmail) {
      payload.fromEmail = formData.fromEmail;
    }
    updateMutation.mutate({
      id: editingProvider.id,
      data: payload,
    });
  }, [editingProvider, formData, updateMutation]);

  const handleDisable = useCallback(() => {
    if (!disablingProvider) return;
    disableMutation.mutate({
      id: disablingProvider.id,
      data: {
        enabled: false,
      },
    });
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

  const providerData: any = providersResponse?.data;
  const providers: ChannelProvider[] = Array.isArray(providerData)
    ? providerData
    : providerData?.data || [];

  const channelData: any = channelsResponse;
  const channels: Channel[] = Array.isArray(channelData)
    ? channelData
    : channelData?.data || [];

  const availableProviderData: any = availableProvidersResponse?.data;
  const availableProviders: string[] = Array.isArray(
    availableProviderData
  )
    ? availableProviderData
    : availableProviderData?.data || [];

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
