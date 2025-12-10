import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PagesService } from "@/services/masterdata/page.service";
import { PermissionService } from "@/services/masterdata/permission.service";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";

interface PageFormData {
  name: string;
}

interface PermissionField {
  id: string;
  name: string;
}

interface UsePageManagementFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;

  pageId?: string;
  pageName: string;
  permissionFields: PermissionField[];

  isLoadingDetail: boolean;
  isSaving: boolean;

  handleSave: (formData: PageFormData) => Promise<void>;
  loadPageDetail: (id: string) => void;
  handleAddPermission: () => void;
  handleDeletePermission: (id: string) => Promise<void>;
  handleChangePermission: (index: number, value: string) => void;
  goBack: () => void;
}

export function usePageManagementForm(
  mode: "create" | "edit" = "create"
): UsePageManagementFormProps {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pagesService = new PagesService();
  const permissionService = new PermissionService();

  const [pageId, setPageId] = useState<string>();
  const [permissionFields, setPermissionFields] = useState<PermissionField[]>([
    { id: "", name: "" },
  ]);

  const isEdit = mode === "edit";

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PageFormData>({
    defaultValues: {
      name: "",
    },
  });

  const { data: pageDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["page-detail", pageId],
    queryFn: async () => {
      if (!pageId) return null;
      const response = await pagesService.getPagesById(pageId);
      return response.data;
    },
    enabled: !!pageId && isEdit,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const { data: permissionsData } = useQuery({
    queryKey: ["page-permissions", pageId],
    queryFn: async () => {
      if (!pageId) return [];
      const response = await permissionService.getPermission(1, 100, pageId);
      return response.data;
    },
    enabled: !!pageId && isEdit,
    staleTime: 30000,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: PageFormData) => {
      if (isEdit && pageId) {
        return await pagesService.updatePages(data, pageId);
      } else {
        return await pagesService.savePages(data);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.invalidateQueries({ queryKey: ["page-detail"] });

      toast.success(
        isEdit ? "Page Updated Successfully!" : "Page Created Successfully!"
      );

      if (!isEdit && response.data?.id) {
        router.push(
          `${AppURL.masterdataPageManagementDetail}/${response.data.id}`
        );
      } else {
        router.push(AppURL.masterdataPageManagement);
      }
    },
    onError: (error: any) => {
      console.error("Save failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save page. Please try again."
      );
    },
  });

  const addPermissionMutation = useMutation({
    mutationFn: async (data: { page: string; name: string }) => {
      return await permissionService.savePermission(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-permissions", pageId] });
      toast.success("Permission added successfully");
    },
  });

  const deletePermissionMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      return await permissionService.deletePermission(permissionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-permissions", pageId] });
      toast.success("Permission deleted successfully");
    },
  });

  useEffect(() => {
    if (pageDetail && isEdit) {
      reset({
        name: pageDetail.name || "",
      });
    }
  }, [pageDetail, reset, isEdit]);

  useEffect(() => {
    if (permissionsData && permissionsData.length > 0) {
      const updateFormValue = permissionsData.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setPermissionFields(updateFormValue);
    } else if (isEdit) {
      setPermissionFields([{ id: "", name: "" }]);
    }
  }, [permissionsData, isEdit]);

  const handleSave = useCallback(
    async (formData: PageFormData) => {
      if (!formData.name) {
        toast.error("Page name is required");
        return;
      }

      try {
        const response = await saveMutation.mutateAsync(formData);

        if (isEdit && pageId) {
          const existingPermissions =
            permissionsData?.map((perm: any) => perm.name) || [];

          for (const permission of permissionFields) {
            if (
              permission.name &&
              !existingPermissions.includes(permission.name)
            ) {
              await addPermissionMutation.mutateAsync({
                page: pageId,
                name: permission.name,
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to save:", error);
      }
    },
    [
      saveMutation,
      isEdit,
      pageId,
      permissionFields,
      permissionsData,
      addPermissionMutation,
    ]
  );

  const loadPageDetail = useCallback((id: string) => {
    setPageId(id);
  }, []);

  const handleAddPermission = useCallback(() => {
    const updateFormValue = [...permissionFields];
    updateFormValue.push({ id: "", name: "" });
    setPermissionFields(updateFormValue);
  }, [permissionFields]);

  const handleDeletePermission = useCallback(
    async (id: string) => {
      if (!id) {
        setPermissionFields((prev) => prev.filter((field) => field.id !== id));
        return;
      }

      if (window.confirm("Are you sure you want to delete this permission?")) {
        await deletePermissionMutation.mutateAsync(id);
        setPermissionFields((prev) => prev.filter((field) => field.id !== id));
      }
    },
    [deletePermissionMutation]
  );

  const handleChangePermission = useCallback(
    (index: number, value: string) => {
      const updateFormValue = [...permissionFields];
      updateFormValue[index] = { ...updateFormValue[index], name: value || "" };
      setPermissionFields(updateFormValue);
    },
    [permissionFields]
  );

  const goBack = useCallback(() => {
    router.push(AppURL.masterdataPageManagement);
  }, [router]);

  return {
    handleSubmit,
    control,
    errors,
    setValue,
    watch,
    pageId,
    pageName: watch("name"),
    permissionFields,
    isLoadingDetail,
    isSaving: saveMutation.isPending,
    handleSave,
    loadPageDetail,
    handleAddPermission,
    handleDeletePermission,
    handleChangePermission,
    goBack,
  };
}
