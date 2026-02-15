import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";
import { usePageDetail, usePermissionByPage } from "@/services/auth/hooks/queries";
import {
  useCreatePage,
  useCreatePermission,
  useDeletePermission,
  useUpdatePage,
} from "@/services/auth/hooks/mutations";

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

  const { data: pageDetail, isLoading: isLoadingDetail } = usePageDetail(
    pageId || "",
    {
    enabled: !!pageId && isEdit,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    },
  );

  const {
    data: permissionsData,
    refetch: refetchPermissionsData,
  } = usePermissionByPage(
    pageId || "",
    {
      page: 1,
      pageSize: 100,
    },
    {
      enabled: !!pageId && isEdit,
      staleTime: 30000,
    }
  );

  const createPageMutation = useCreatePage({
    onSuccess: (response: any) => {
      toast.success("Page Created Successfully!");

      const createdId = response?.data?.id || response?.id;
      if (createdId) {
        router.push(`${AppURL.masterdataPageManagementDetail}/${createdId}`);
        return;
      }

      router.push(AppURL.masterdataPageManagement);
    },
    onError: (error: any) => {
      console.error("Save failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save page. Please try again."
      );
    },
  });

  const updatePageMutation = useUpdatePage({
    onSuccess: () => {
      toast.success("Page Updated Successfully!");
      router.push(AppURL.masterdataPageManagement);
    },
    onError: (error: any) => {
      console.error("Save failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save page. Please try again."
      );
    },
  });

  const addPermissionMutation = useCreatePermission({
    onSuccess: () => {
      refetchPermissionsData();
      toast.success("Permission added successfully");
    },
  });

  const deletePermissionMutation = useDeletePermission({
    onSuccess: () => {
      refetchPermissionsData();
      toast.success("Permission deleted successfully");
    },
  });

  const normalizedPageDetail = (pageDetail as any)?.data ?? pageDetail;
  const normalizedPermissionsData =
    (permissionsData as any)?.data ?? permissionsData ?? [];

  useEffect(() => {
    if (normalizedPageDetail && isEdit) {
      reset({
        name: (normalizedPageDetail as any).name || "",
      });
    }
  }, [normalizedPageDetail, reset, isEdit]);

  useEffect(() => {
    if (normalizedPermissionsData && normalizedPermissionsData.length > 0) {
      const updateFormValue = normalizedPermissionsData.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setPermissionFields(updateFormValue);
    } else if (isEdit) {
      setPermissionFields([{ id: "", name: "" }]);
    }
  }, [normalizedPermissionsData, isEdit]);

  const handleSave = useCallback(
    async (formData: PageFormData) => {
      if (!formData.name) {
        toast.error("Page name is required");
        return;
      }

      try {
        if (isEdit && pageId) {
          await updatePageMutation.mutateAsync({ id: pageId, payload: formData });

          const existingPermissions =
            normalizedPermissionsData?.map((perm: any) => perm.name) || [];

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
          return;
        }

        await createPageMutation.mutateAsync(formData);
      } catch (error) {
        console.error("Failed to save:", error);
      }
    },
    [
      addPermissionMutation,
      createPageMutation,
      isEdit,
      normalizedPermissionsData,
      pageId,
      permissionFields,
      updatePageMutation,
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
    isSaving: createPageMutation.isPending || updatePageMutation.isPending,
    handleSave,
    loadPageDetail,
    handleAddPermission,
    handleDeletePermission,
    handleChangePermission,
    goBack,
  };
}

