import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { authService } from "@/services/auth/api/auth.service";
import AppURL from "@/constants/app-url.const";
import { usePages, useRoleDetail } from "@/services/auth/hooks/queries";
import {
  useCreateRole,
  useCreateRolePermission,
  useDeleteRolePermission,
  useUpdateRole,
} from "@/services/auth/hooks/mutations";

interface RoleFormData {
  name: string;
  description: string;
}

interface MenuPermissionForm {
  menuId: string;
  menu: string;
  permission: string[];
  isEditable: boolean;
}

interface UseRoleFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;

  roleId?: string;
  roleName: string;
  roleDescription: string;
  permissionFields: MenuPermissionForm[];
  permissionOptions: any;
  menus: any[];

  isLoadingDetail: boolean;
  isLoadingMenus: boolean;
  isSaving: boolean;

  handleSave: (formData: RoleFormData) => Promise<void>;
  loadRoleDetail: (id: string) => void;
  handleAddPermission: () => void;
  handleDeletePermission: (id: string) => Promise<void>;
  handleSaveRolePermission: (index: number) => void;
  handleBulkEditPermission: (index: number) => Promise<void>;
  handleBulkDeleteRolePermission: (index: number) => Promise<void>;
  handleTickPermission: (
    isChecked: boolean,
    permissionId: string,
    index: number
  ) => Promise<void>;
  selectMenu: (value: string, field: any, index: number) => Promise<void>;
  setPermissionFields: (fields: MenuPermissionForm[]) => void;
  goBack: () => void;
}

export function useRoleForm(
  mode: "create" | "edit" = "create"
): UseRoleFormProps {
  const router = useRouter();

  const [roleId, setRoleId] = useState<string>();
  const [permissionFields, setPermissionFields] = useState<
    MenuPermissionForm[]
  >([]);
  const [permissionOptions, setPermissionOptions] = useState<any>({});

  const isEdit = mode === "edit";

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<RoleFormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    data: roleDetail,
    isLoading: isLoadingDetail,
  } = useRoleDetail(roleId || "", {
    enabled: !!roleId && isEdit,
    staleTime: 300000,
  });

  const { data: menusData, isLoading: isLoadingMenus } = usePages(
    { page: 1, pageSize: 100 },
    { staleTime: 300000 }
  );

  const createRoleMutation = useCreateRole({
    onSuccess: (response: any) => {
      const createdId = response?.data?.id || response?.id;
      if (createdId) {
        router.push(`${AppURL.masterdataRoleDetail}/${createdId}`);
        return;
      }

      router.push(AppURL.masterdataRole);
    },
    onError: (error) => {
      console.error("Save failed:", error);
      alert("Failed to save role");
    },
  });

  const updateRoleMutation = useUpdateRole({
    onSuccess: () => {
      router.push(AppURL.masterdataRole);
    },
    onError: (error) => {
      console.error("Save failed:", error);
      alert("Failed to save role");
    },
  });

  const addPermissionMutation = useCreateRolePermission();

  const deletePermissionMutation = useDeleteRolePermission();

  const normalizedRoleDetailResponse = (roleDetail as any)?.data;
  const normalizedRoleDetail = Array.isArray(normalizedRoleDetailResponse)
    ? normalizedRoleDetailResponse[0]
    : normalizedRoleDetailResponse ?? roleDetail;
  const menus = (menusData as any)?.data ?? menusData ?? [];

  useEffect(() => {
    if (normalizedRoleDetail && isEdit) {
      reset({
        name: (normalizedRoleDetail as any).name || "",
        description: (normalizedRoleDetail as any).description || "",
      });

      const groupedPermissions = (normalizedRoleDetail as any).role_permissions?.reduce(
        (acc: any, role: any) => {
          const menuName = role?.permissions?.pages?.name || "-";
          if (!acc[menuName]) {
            acc[menuName] = {
              id: role.permissions.pages.id,
              permissions: [],
            };
          }
          acc[menuName].permissions.push(role);
          return acc;
        },
        {}
      );

      const updatedPermissionOpt: any = {};
      const updatedPermissionFields = Object.keys(groupedPermissions || {}).map(
        (key) => {
          const acquiredPermissions: string[] = [];
          const rolePermissionOpt: any[] = [];

          groupedPermissions[key].permissions.forEach((item: any) => {
            acquiredPermissions.push(item.permissions.id);
            rolePermissionOpt.push({
              id: item.id,
              permissions: {
                id: item.permissions.id,
                name: item.permissions.name,
              },
            });
          });

          const menuId = groupedPermissions[key].id;
          updatedPermissionOpt[menuId] = rolePermissionOpt;

          return {
            menu: key,
            menuId: menuId,
            permission: acquiredPermissions,
            isEditable: false,
          };
        }
      );

      setPermissionOptions(updatedPermissionOpt);
      setPermissionFields(updatedPermissionFields);
    }
  }, [normalizedRoleDetail, reset, isEdit]);

  const handleSave = useCallback(
    async (formData: RoleFormData) => {
      if (!formData.name) {
        alert("Role name is required");
        return;
      }

      if (isEdit && roleId) {
        await updateRoleMutation.mutateAsync({ id: roleId, payload: formData });
        return;
      }

      await createRoleMutation.mutateAsync(formData);
    },
    [createRoleMutation, isEdit, roleId, updateRoleMutation]
  );

  const loadRoleDetail = useCallback((id: string) => {
    setRoleId(id);
  }, []);

  const handleAddPermission = useCallback(() => {
    const updateFormValue = [...permissionFields];
    updateFormValue.push({
      menu: "",
      menuId: "",
      permission: [],
      isEditable: true,
    });
    setPermissionFields(updateFormValue);
  }, [permissionFields]);

  const handleDeletePermission = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this permission?")) {
        await deletePermissionMutation.mutateAsync(id);
      }
    },
    [deletePermissionMutation]
  );

  const selectMenu = useCallback(
    async (value: string, field: any, index: number) => {
      const updateFormValue = [...permissionFields];
      const selectedMenu = menus?.find((item: any) => item.id === value);
      updateFormValue[index].menu = selectedMenu?.name || "";
      updateFormValue[index].menuId = value;
      setPermissionFields(updateFormValue);
      field.onChange(value);

      try {
        const result: any = await authService.getPermissionsByPage(value, {
          page: 1,
          pageSize: 100,
        });
        const updatedPermissionOpt: any = { ...permissionOptions };
        const permissionData = result?.data ?? result ?? [];
        const permissionOption = permissionData.map((item: any) => ({
          id: "",
          permissions: {
            id: item.id,
            name: item.name,
          },
        }));
        updatedPermissionOpt[value] = permissionOption;
        setPermissionOptions(updatedPermissionOpt);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    },
    [permissionFields, menus, permissionOptions]
  );

  const handleTickPermission = useCallback(
    async (isChecked: boolean, permissionId: string, index: number) => {
      if (!roleId) return;

      const updatedPermission = [...permissionFields];
      const currentPermission = [...permissionFields[index].permission];
      const menuId = permissionFields[index].menuId;
      const currentMenuPermission = [...(permissionOptions[menuId] || [])];
      const updatedPermissionOptions = { ...permissionOptions };

      if (isChecked) {
        currentPermission.push(permissionId);

        try {
          const response: any = await addPermissionMutation.mutateAsync({
            role: roleId,
            permission: permissionId,
          });

          const updatedMenuPermission = currentMenuPermission.map(
            (item: any) => {
              if (item.permissions.id === permissionId) {
                return { ...item, id: response.data.id };
              }
              return item;
            }
          );

          updatedPermissionOptions[menuId] = updatedMenuPermission;
        } catch (error) {
          console.error("Failed to add permission:", error);

          const key = currentPermission.indexOf(permissionId);
          if (key > -1) currentPermission.splice(key, 1);
        }
      } else {
        const trxPermissionId = currentMenuPermission.find(
          (item: any) => item.permissions.id === permissionId
        )?.id;

        if (trxPermissionId) {
          try {
            await deletePermissionMutation.mutateAsync(trxPermissionId);

            const updatedMenuPermission = currentMenuPermission.map(
              (item: any) => {
                if (item.permissions.id === permissionId) {
                  return { ...item, id: "" };
                }
                return item;
              }
            );

            updatedPermissionOptions[menuId] = updatedMenuPermission;

            const key = currentPermission.indexOf(permissionId);
            if (key > -1) currentPermission.splice(key, 1);
          } catch (error) {
            console.error("Failed to delete permission:", error);
          }
        }
      }

      updatedPermission[index] = {
        ...updatedPermission[index],
        permission: currentPermission,
      };

      setPermissionOptions(updatedPermissionOptions);
      setPermissionFields(updatedPermission);
    },
    [
      permissionFields,
      permissionOptions,
      roleId,
      addPermissionMutation,
      deletePermissionMutation,
    ]
  );

  const handleSaveRolePermission = useCallback(
    (index: number) => {
      const updateFormValue = [...permissionFields];
      updateFormValue[index].isEditable = false;
      setPermissionFields(updateFormValue);
    },
    [permissionFields]
  );

  const handleBulkEditPermission = useCallback(
    async (index: number) => {
      try {
        const result: any = await authService.getPermissionsByPage(
          permissionFields[index].menuId,
          { page: 1, pageSize: 100 }
        );

        const menuId = permissionFields[index].menuId;
        const permissionData = result?.data ?? result ?? [];
        const menuPermissionOpt = permissionData.map((item: any) => {
          const authPermission = permissionOptions[menuId]?.find(
            (currentPermission: any) =>
              currentPermission.permissions.id === item.id
          );

          return {
            id: authPermission ? authPermission.id : "",
            permissions: {
              id: item.id,
              name: item.name,
            },
          };
        });

        const updatedPermissionOpt = { ...permissionOptions };
        updatedPermissionOpt[menuId] = menuPermissionOpt;
        setPermissionOptions(updatedPermissionOpt);

        const updateFormValue = [...permissionFields];
        updateFormValue[index].isEditable = true;
        setPermissionFields(updateFormValue);
      } catch (error) {
        console.error("Failed to edit permission:", error);
      }
    },
    [permissionFields, permissionOptions]
  );

  const handleBulkDeleteRolePermission = useCallback(
    async (index: number) => {
      if (
        window.confirm("Are you sure you want to delete this menu permission?")
      ) {
        try {
          const { menuId } = permissionFields[index];
          if (menuId && permissionOptions[menuId]) {
            for (let i = 0; i < permissionOptions[menuId].length; i++) {
              const trxPermissionId = permissionOptions[menuId][i].id;
              if (trxPermissionId) {
                await deletePermissionMutation.mutateAsync(trxPermissionId);
              }
            }

            const updatedPermissionFields = [...permissionFields];
            updatedPermissionFields.splice(index, 1);
            setPermissionFields(updatedPermissionFields);
          }
        } catch (error) {
          console.error("Failed to delete permission role:", error);
        }
      }
    },
    [permissionFields, permissionOptions, deletePermissionMutation]
  );

  const goBack = useCallback(() => {
    router.push(AppURL.masterdataRole);
  }, [router]);

  return {
    handleSubmit,
    control,
    errors,
    setValue,
    watch,
    roleId,
    roleName: watch("name"),
    roleDescription: watch("description"),
    permissionFields,
    permissionOptions,
    menus: menus || [],
    isLoadingDetail,
    isLoadingMenus,
    isSaving: createRoleMutation.isPending || updateRoleMutation.isPending,
    handleSave,
    loadRoleDetail,
    handleAddPermission,
    handleDeletePermission,
    handleSaveRolePermission,
    handleBulkEditPermission,
    handleBulkDeleteRolePermission,
    handleTickPermission,
    selectMenu,
    setPermissionFields,
    goBack,
  };
}

