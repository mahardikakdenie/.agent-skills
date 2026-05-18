import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

import ApiURL from '@/constants/api-url.const';
import { useAuth } from '@/context/auth.context';
import { toastNotification } from '@/lib/toast';
import { channelService } from '@/services/api.service';
import {
  CrmConfigService,
  ChannelMapping,
  ChannelMappingPayload,
  ThirdPartyConfig,
} from '@/services/crm-config.service';

const CRM_RELATION_ID = '8bad5007-a399-40cb-a6cd-dfec7efeee58';

const EMPTY_FORM: ChannelMappingPayload = {
  channel: '',
  third_party_id: '',
  relation_id: CRM_RELATION_ID,
};

interface ChannelOption {
  id: string;
  name: string;
  [key: string]: unknown;
}

type ApiListResponse<T> = T[] | { data?: T[] };

interface ApiErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const extractList = <T,>(response?: ApiListResponse<T>): T[] => {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.data || [];
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const message = (error as ApiErrorLike)?.response?.data?.message;

  return typeof message === 'string' && message.length > 0 ? message : fallback;
};

export function useChannelMapping() {
  const { handleResponseError } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<ChannelMapping | null>(null);
  const [deletingMapping, setDeletingMapping] = useState<ChannelMapping | null>(null);
  const [formData, setFormData] = useState<ChannelMappingPayload>({
    ...EMPTY_FORM,
  });

  const resetForm = useCallback(() => {
    setFormData({ ...EMPTY_FORM });
  }, []);

  // Fetch channels for the dropdown and display labels.
  const { data: channelsResponse } = useQuery({
    queryKey: ['channels-list'],
    queryFn: async () => {
      const res = await channelService.get<ApiListResponse<ChannelOption>>(ApiURL.v1Channels, {
        params: { page: 1, limit: 1000 },
      });
      return res.data;
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Fetch third party configs for the dropdown
  const { data: thirdPartiesResponse } = useQuery({
    queryKey: ['third-party-configs-dropdown'],
    queryFn: async () => {
      const res = (await CrmConfigService.getConfigurations()) as {
        data: ApiListResponse<ThirdPartyConfig>;
      };
      return res.data;
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Fetch mappings independently so table data can render even if channel labels fail.
  const {
    data: mappingsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['channel-mappings', search],
    queryFn: async () => {
      const res = (await CrmConfigService.getChannelMappings(search ? { search } : undefined)) as {
        data: ApiListResponse<ChannelMapping>;
      };
      return res.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: ChannelMappingPayload) => CrmConfigService.createChannelMapping(data),
    onSuccess: () => {
      toastNotification('Channel mapping created successfully');
      queryClient.invalidateQueries({ queryKey: ['channel-mappings'] });
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: unknown) => {
      toastNotification(getErrorMessage(error, 'Failed to create channel mapping'), 'error');
      handleResponseError(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ChannelMappingPayload> }) =>
      CrmConfigService.updateChannelMapping(id, data),
    onSuccess: () => {
      toastNotification('Channel mapping updated successfully');
      queryClient.invalidateQueries({ queryKey: ['channel-mappings'] });
      setEditingMapping(null);
      resetForm();
    },
    onError: (error: unknown) => {
      toastNotification(getErrorMessage(error, 'Failed to update channel mapping'), 'error');
      handleResponseError(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CrmConfigService.deleteChannelMapping(id),
    onSuccess: () => {
      toastNotification('Channel mapping deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['channel-mappings'] });
      setDeletingMapping(null);
    },
    onError: (error: unknown) => {
      toastNotification(getErrorMessage(error, 'Failed to delete channel mapping'), 'error');
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
      relation_id: mapping.relation_id || '',
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

  const mappings: ChannelMapping[] = extractList(mappingsResponse);

  const thirdParties: ThirdPartyConfig[] = extractList(thirdPartiesResponse);

  const channels: ChannelOption[] = extractList(channelsResponse);

  const handleSearch = useCallback((keyword: string) => {
    setSearch(keyword);
  }, []);

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
