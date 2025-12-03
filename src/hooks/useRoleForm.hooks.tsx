import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { RoleService } from "@/services/masterdata/roles.service";
import AppURL from "@/constants/app-url.const";

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
  const queryClient = useQueryClient();
  const roleService = new RoleService();

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
    refetch: refetchRoleDetail,
  } = useQuery({
    queryKey: ["role-detail", roleId],
    queryFn: async () => {
      if (!roleId) return null;
      const response = await roleService.getRoleById(roleId);
      return response.data;
    },
    enabled: !!roleId && isEdit,
    staleTime: 300000,
  });

  const { data: menusData, isLoading: isLoadingMenus } = useQuery({
    queryKey: ["menus-list"],
    queryFn: async () => {
      const response = await roleService.getMenu(1, 100);
      return response.data;
    },
    staleTime: 300000,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: RoleFormData) => {
      if (isEdit && roleId) {
        return await roleService.updateRole(data, roleId);
      } else {
        return await roleService.addRole(data);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role-detail"] });

      if (!isEdit && response.data?.id) {
        router.push(`${AppURL.masterdataRoleDetail}/${response.data.id}`);
      } else {
        router.push(AppURL.masterdataRole);
      }
    },
    onError: (error) => {
      console.error("Save failed:", error);
      alert("Failed to save role");
    },
  });

  const addPermissionMutation = useMutation({
    mutationFn: async (data: { role: string; permission: string }) => {
      return await roleService.createPermissionRole(data);
    },
  });

  const deletePermissionMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      return await roleService.deletePermissionRole(permissionId);
    },
  });

  useEffect(() => {
    if (roleDetail && isEdit) {
      console.log("✅DY: Setting form with role:", roleDetail);

      reset({
        name: roleDetail.name || "",
        description: roleDetail.description || "",
      });

      const groupedPermissions = roleDetail.role_permissions?.reduce(
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
  }, [roleDetail, reset, isEdit]);

  const handleSave = useCallback(
    async (formData: RoleFormData) => {
      if (!formData.name) {
        alert("Role name is required");
        return;
      }

      await saveMutation.mutateAsync(formData);
    },
    [saveMutation]
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
      const selectedMenu = menusData?.find((item: any) => item.id === value);
      updateFormValue[index].menu = selectedMenu?.name || "";
      updateFormValue[index].menuId = value;
      setPermissionFields(updateFormValue);
      field.onChange(value);

      try {
        const result = await roleService.getPermission(1, 100, value);
        const updatedPermissionOpt: any = { ...permissionOptions };
        const permissionOption = result.data.map((item: any) => ({
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
    [permissionFields, menusData, permissionOptions, roleService]
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
          const response = await addPermissionMutation.mutateAsync({
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
        const result = await roleService.getPermission(
          1,
          100,
          permissionFields[index].menuId
        );

        const menuId = permissionFields[index].menuId;
        const menuPermissionOpt = result.data.map((item: any) => {
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

        setValue(`menu.${index}`, updateFormValue[index].menuId);
        setValue(`permission.${index}`, updateFormValue[index].permission);
      } catch (error) {
        console.error("Failed to edit permission:", error);
      }
    },
    [permissionFields, permissionOptions, setValue, roleService]
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
    menus: menusData || [],
    isLoadingDetail,
    isLoadingMenus,
    isSaving: saveMutation.isPending,
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
