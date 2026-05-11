import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth.context";
import _ from "lodash";
import {
  CrmConfigService,
  ChannelMapping,
  ChannelMappingPayload,
  ThirdPartyConfig,
} from "@/services/crm-config.service";
import { channelService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import { toastNotification } from "@/lib/toast";

const CRM_RELATION_ID = "8bad5007-a399-40cb-a6cd-dfec7efeee58";

const EMPTY_FORM: ChannelMappingPayload = {
  channel: "",
  third_party_id: "",
  relation_id: CRM_RELATION_ID,
};

export function useChannelMapping() {
  const { handleResponseError } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<ChannelMapping | null>(
    null
  );
  const [deletingMapping, setDeletingMapping] = useState<ChannelMapping | null>(
    null
  );
  const [formData, setFormData] = useState<ChannelMappingPayload>({
    ...EMPTY_FORM,
  });

  const resetForm = useCallback(() => {
    setFormData({ ...EMPTY_FORM });
  }, []);

  // Fetch channels for the dropdown (from channel-service) — load first
  const { data: channelsResponse, isSuccess: isChannelsLoaded } = useQuery({
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

  // Fetch third party configs for the dropdown
  const { data: thirdPartiesResponse } = useQuery({
    queryKey: ["third-party-configs-dropdown"],
    queryFn: async () => {
      const res: any = await CrmConfigService.getConfigurations();
      return res.data;
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Fetch mappings only after channels are loaded
  const {
    data: mappingsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["channel-mappings", search],
    queryFn: async () => {
      const res: any = await CrmConfigService.getChannelMappings(
        search ? { search } : undefined
      );
      return res.data;
    },
    enabled: isChannelsLoaded,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: ChannelMappingPayload) =>
      CrmConfigService.createChannelMapping(data),
    onSuccess: () => {
      toastNotification("Channel mapping created successfully");
      queryClient.invalidateQueries({ queryKey: ["channel-mappings"] });
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create channel mapping";
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
      data: Partial<ChannelMappingPayload>;
    }) => CrmConfigService.updateChannelMapping(id, data),
    onSuccess: () => {
      toastNotification("Channel mapping updated successfully");
      queryClient.invalidateQueries({ queryKey: ["channel-mappings"] });
      setEditingMapping(null);
      resetForm();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update channel mapping";
      toastNotification(message, "error");
      handleResponseError(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CrmConfigService.deleteChannelMapping(id),
    onSuccess: () => {
      toastNotification("Channel mapping deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["channel-mappings"] });
      setDeletingMapping(null);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete channel mapping";
      toastNotification(message, "error");
      handleResponseError(error);
    },
  });

  const openCreate = useCallback(() => {
    resetForm();
    setIsCreateOpen(true);
  }, [resetForm]);

  const openEdit = useCallback((mapping: ChannelMapping) => {
    setFormData({
      channel: mapping.channel,
      third_party_id: mapping.third_party_id,
      relation_id: mapping.relation_id || "",
    });
    setEditingMapping(mapping);
  }, []);

  const handleCreate = useCallback(() => {
    const payload: ChannelMappingPayload = {
      channel: formData.channel,
      third_party_id: formData.third_party_id,
      relation_id: CRM_RELATION_ID,
    };
    createMutation.mutate(payload);
  }, [formData, createMutation]);

  const handleUpdate = useCallback(() => {
    if (!editingMapping) return;
    const payload: Partial<ChannelMappingPayload> = {
      third_party_id: formData.third_party_id,
      relation_id: CRM_RELATION_ID,
    };
    updateMutation.mutate({ id: editingMapping.id, data: payload });
  }, [editingMapping, formData, updateMutation]);

  const handleDelete = useCallback(() => {
    if (!deletingMapping) return;
    deleteMutation.mutate(deletingMapping.id);
  }, [deletingMapping, deleteMutation]);

  const mappings: ChannelMapping[] = Array.isArray(mappingsResponse)
    ? mappingsResponse
    : mappingsResponse?.data || [];

  const thirdPartyRaw = thirdPartiesResponse;
  const thirdParties: ThirdPartyConfig[] = Array.isArray(thirdPartyRaw)
    ? thirdPartyRaw
    : (thirdPartyRaw as any)?.data || [];

  const channels: { id: string; name: string; [key: string]: any }[] =
    Array.isArray(channelsResponse)
      ? channelsResponse
      : channelsResponse?.data || [];

  const handleSearch = useMemo(
    () =>
      _.debounce((keyword: string) => {
        setSearch(keyword);
      }, 300),
    []
  );

  return {
    mappings,
    thirdParties,
    channels,
    isLoading,
    search,
    handleSearch,
    isCreateOpen,
    setIsCreateOpen,
    editingMapping,
    setEditingMapping,
    deletingMapping,
    setDeletingMapping,
    formData,
    setFormData,
    openCreate,
    openEdit,
    handleCreate,
    handleUpdate,
    handleDelete,
    resetForm,
    refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
