import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { authService } from "@/services/auth/api/auth.service";
import AppURL from "@/constants/app-url.const";

interface GroupFormData {
  name: string;
}

interface useGroupFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;

  groupId?: string;
  groupName: string;

  groupRoles: any[];
  groupUsers: any[];
  availableRoles: any[];
  availableUsers: any[];

  isLoadingDetail: boolean;
  isLoadingRoles: boolean;
  isLoadingUsers: boolean;
  isSaving: boolean;

  handleSave: (formData: GroupFormData) => Promise<void>;
  loadGroupDetail: (id: string) => void;
  handleAddRole: (roleIds: string[]) => Promise<void>;
  handleDeleteRole: (groupRoleId: string) => Promise<void>;
  handleAddUser: (userIds: string[]) => Promise<void>;
  handleDeleteUser: (groupUserId: string) => Promise<void>;
  goBack: () => void;
}

export function useGroupForm(
  mode: "create" | "edit" = "create"
): useGroupFormProps {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [groupId, setGroupId] = useState<string>();
  const [groupRoles, setGroupRoles] = useState<any[]>([]);
  const [groupUsers, setGroupUsers] = useState<any[]>([]);

  const isEdit = mode === "edit";

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<GroupFormData>({
    defaultValues: {
      name: "",
    },
  });

  const {
    data: groupDetail,
    isLoading: isLoadingDetail,
    refetch: refetchGroupDetail,
  } = useQuery({
    queryKey: ["group-detail", groupId],
    queryFn: async () => {
      if (!groupId) return null;
      const response: any = await authService.getGroupById(groupId);
      return response?.data ?? response;
    },
    enabled: !!groupId && isEdit,
    staleTime: 300000,
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles-list"],
    queryFn: async () => {
      const response: any = await authService.getRoles({ page: 1, pageSize: 1000 });
      return response?.data ?? response;
    },
    staleTime: 300000,
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      const response: any = await authService.getAccounts({
        page: 1,
        pageSize: 1000,
      });
      return response?.data ?? response;
    },
    staleTime: 300000,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: GroupFormData) => {
      if (isEdit && groupId) {
        return await authService.updateGroup(groupId, data);
      } else {
        return await authService.createGroup(data);
      }
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group-detail"] });

      if (!isEdit && response.data?.id) {
        router.push(`${AppURL.masterdataGroupDetail}/${response.data.id}`);
      } else {
        router.push(AppURL.masterdataGroup);
      }
    },
    onError: (error) => {
      console.error("Save failed:", error);
      alert("Failed to save group");
    },
  });

  const addRoleMutation = useMutation({
    mutationFn: async (roleIds: string[]) => {
      if (!groupId) throw new Error("Group ID is required");

      const promises = roleIds.map((roleId) =>
        authService.addGroupRole({
          group: groupId,
          role: roleId,
        })
      );

      return await Promise.all(promises);
    },
    onSuccess: () => {
      refetchGroupDetail();
    },
    onError: (error) => {
      console.error("Add role failed:", error);
      alert("Failed to add roles");
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (groupRoleId: string) => {
      return await authService.removeGroupRole(groupRoleId);
    },
    onSuccess: () => {
      refetchGroupDetail();
    },
    onError: (error) => {
      console.error("Delete role failed:", error);
      alert("Failed to delete role");
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      if (!groupId) throw new Error("Group ID is required");

      const promises = userIds.map((userId) =>
        authService.addAccountGroup({
          account: userId,
          group: groupId,
        })
      );

      return await Promise.all(promises);
    },
    onSuccess: () => {
      refetchGroupDetail();
    },
    onError: (error) => {
      console.error("Add user failed:", error);
      alert("Failed to add users");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (groupUserId: string) => {
      return await authService.removeAccountGroup(groupUserId);
    },
    onSuccess: () => {
      refetchGroupDetail();
    },
    onError: (error) => {
      console.error("Delete user failed:", error);
      alert("Failed to delete user");
    },
  });

  useEffect(() => {
    if (groupDetail && isEdit) {
      reset({
        name: groupDetail.name || "",
      });

      setGroupRoles(groupDetail.group_roles || []);
      setGroupUsers(groupDetail.account_groups || []);
    }
  }, [groupDetail, reset, isEdit]);

  const handleSave = useCallback(
    async (formData: GroupFormData) => {
      if (!formData.name) {
        alert("Group name is required");
        return;
      }

      await saveMutation.mutateAsync(formData);
    },
    [saveMutation]
  );

  const loadGroupDetail = useCallback((id: string) => {
    setGroupId(id);
  }, []);

  const handleAddRole = useCallback(
    async (roleIds: string[]) => {
      await addRoleMutation.mutateAsync(roleIds);
    },
    [addRoleMutation]
  );

  const handleDeleteRole = useCallback(
    async (groupRoleId: string) => {
      if (window.confirm("Are you sure you want to remove this role?")) {
        await deleteRoleMutation.mutateAsync(groupRoleId);
      }
    },
    [deleteRoleMutation]
  );

  const handleAddUser = useCallback(
    async (userIds: string[]) => {
      await addUserMutation.mutateAsync(userIds);
    },
    [addUserMutation]
  );

  const handleDeleteUser = useCallback(
    async (groupUserId: string) => {
      if (window.confirm("Are you sure you want to remove this user?")) {
        await deleteUserMutation.mutateAsync(groupUserId);
      }
    },
    [deleteUserMutation]
  );

  const goBack = useCallback(() => {
    router.push(AppURL.masterdataGroup);
  }, [router]);

  const availableRoles =
    rolesData?.filter(
      (role: any) => !groupRoles.some((gr: any) => gr.roles?.id === role.id)
    ) || [];

  const availableUsers =
    usersData?.filter(
      (user: any) => !groupUsers.some((gu: any) => gu.accounts?.id === user.id)
    ) || [];

  return {
    handleSubmit,
    control,
    errors,
    setValue,
    watch,
    groupId,
    groupName: watch("name"),
    groupRoles,
    groupUsers,
    availableRoles,
    availableUsers,
    isLoadingDetail,
    isLoadingRoles,
    isLoadingUsers,
    isSaving: saveMutation.isPending,
    handleSave,
    loadGroupDetail,
    handleAddRole,
    handleDeleteRole,
    handleAddUser,
    handleDeleteUser,
    goBack,
  };
}

