import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth.context";
import _ from "lodash";
import {
  CrmConfigService,
  ThirdPartyConfig,
  ThirdPartyConfigPayload,
} from "@/services/crm-config.service";
import { toastNotification } from "@/lib/toast";

const EMPTY_FORM: ThirdPartyConfigPayload = {
  name: "",
  code: "",
  client_id: "",
  client_secret: "",
  access_token: "",
  refresh_token: "",
  session_id: "",
  module: "",
  configuration: {},
  is_active: true,
};

export function useThirdPartyConfig() {
  const { handleResponseError } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingConfig, setEditingConfig] =
    useState<ThirdPartyConfig | null>(null);
  const [deletingConfig, setDeletingConfig] =
    useState<ThirdPartyConfig | null>(null);
  const [formData, setFormData] = useState<ThirdPartyConfigPayload>({
    ...EMPTY_FORM,
  });

  const resetForm = useCallback(() => {
    setFormData({ ...EMPTY_FORM });
  }, []);

  const {
    data: configurationsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["third-party-configs", search],
    queryFn: async () => {
      const res: any = await CrmConfigService.getConfigurations(
        search ? { search } : undefined
      );
      return res.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: ThirdPartyConfigPayload) =>
      CrmConfigService.createConfiguration(data),
    onSuccess: () => {
      toastNotification("Third party configuration created successfully");
      queryClient.invalidateQueries({ queryKey: ["third-party-configs"] });
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create configuration";
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
      data: Partial<ThirdPartyConfigPayload>;
    }) => CrmConfigService.updateConfiguration(id, data),
    onSuccess: () => {
      toastNotification("Third party configuration updated successfully");
      queryClient.invalidateQueries({ queryKey: ["third-party-configs"] });
      setEditingConfig(null);
      resetForm();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update configuration";
      toastNotification(message, "error");
      handleResponseError(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CrmConfigService.deleteConfiguration(id),
    onSuccess: () => {
      toastNotification("Third party configuration deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["third-party-configs"] });
      setDeletingConfig(null);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete configuration";
      toastNotification(message, "error");
      handleResponseError(error);
    },
  });

  const openCreate = useCallback(() => {
    resetForm();
    setIsCreateOpen(true);
  }, [resetForm]);

  const openEdit = useCallback((config: ThirdPartyConfig) => {
    setFormData({
      name: config.name,
      code: config.code,
      client_id: config.client_id || "",
      client_secret: config.client_secret || "",
      access_token: config.access_token || "",
      refresh_token: config.refresh_token || "",
      session_id: config.session_id || "",
      module: config.module || "",
      configuration: config.configuration || {},
      is_active: config.is_active,
    });
    setEditingConfig(config);
  }, []);

  const handleCreate = useCallback(() => {
    createMutation.mutate(formData);
  }, [formData, createMutation]);

  const handleUpdate = useCallback(() => {
    if (!editingConfig) return;
    updateMutation.mutate({ id: editingConfig.id, data: formData });
  }, [editingConfig, formData, updateMutation]);

  const handleDelete = useCallback(() => {
    if (!deletingConfig) return;
    deleteMutation.mutate(deletingConfig.id);
  }, [deletingConfig, deleteMutation]);

  const configurations: ThirdPartyConfig[] = Array.isArray(
    configurationsResponse
  )
    ? configurationsResponse
    : configurationsResponse?.data || [];

  const handleSearch = useMemo(
    () =>
      _.debounce((keyword: string) => {
        setSearch(keyword);
      }, 300),
    []
  );

  return {
    configurations,
    isLoading,
    search,
    handleSearch,
    isCreateOpen,
    setIsCreateOpen,
    editingConfig,
    setEditingConfig,
    deletingConfig,
    setDeletingConfig,
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
