import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AppURL from "@/constants/app-url.const";
import { useAccounts, useGroupDetail, useRoles } from "@/services/auth/hooks/queries";
import {
  useAddAccountGroup,
  useAddGroupRole,
  useCreateGroup,
  useRemoveAccountGroup,
  useRemoveGroupRole,
  useUpdateGroup,
} from "@/services/auth/hooks/mutations";

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
  } = useGroupDetail(groupId || "", {
    enabled: !!groupId && isEdit,
    staleTime: 300000,
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useRoles(
    { page: 1, pageSize: 1000 },
    { staleTime: 300000 }
  );

  const { data: usersData, isLoading: isLoadingUsers } = useAccounts(
    {
      page: 1,
      pageSize: 1000,
    },
    { staleTime: 300000 }
  );

  const createGroupMutation = useCreateGroup({
    onSuccess: (response: any) => {
      const createdId = response?.data?.id || response?.id;
      if (createdId) {
        router.push(`${AppURL.masterdataGroupDetail}/${createdId}`);
        return;
      }

      router.push(AppURL.masterdataGroup);
    },
    onError: (error) => {
      console.error("Save failed:", error);
      alert("Failed to save group");
    },
  });

  const updateGroupMutation = useUpdateGroup({
    onSuccess: () => {
      router.push(AppURL.masterdataGroup);
    },
    onError: (error) => {
      console.error("Save failed:", error);
      alert("Failed to save group");
    },
  });

  const addRoleMutation = useAddGroupRole({
    onSuccess: () => {
      refetchGroupDetail();
    },
    onError: (error) => {
      console.error("Add role failed:", error);
      alert("Failed to add roles");
    },
  });

  const deleteRoleMutation = useRemoveGroupRole({
    onSuccess: () => {
      refetchGroupDetail();
    },
    onError: (error) => {
      console.error("Delete role failed:", error);
      alert("Failed to delete role");
    },
  });

  const addUserMutation = useAddAccountGroup({
    onSuccess: () => {
      refetchGroupDetail();
    },
    onError: (error) => {
      console.error("Add user failed:", error);
      alert("Failed to add users");
    },
  });

  const deleteUserMutation = useRemoveAccountGroup({
    onSuccess: () => {
      refetchGroupDetail();
    },
    onError: (error) => {
      console.error("Delete user failed:", error);
      alert("Failed to delete user");
    },
  });

  const normalizedGroupDetail = (groupDetail as any)?.data ?? groupDetail;
  const rolesList = (rolesData as any)?.data ?? rolesData ?? [];
  const usersList = (usersData as any)?.data ?? usersData ?? [];

  useEffect(() => {
    if (normalizedGroupDetail && isEdit) {
      reset({
        name: (normalizedGroupDetail as any).name || "",
      });

      setGroupRoles((normalizedGroupDetail as any).group_roles || []);
      setGroupUsers((normalizedGroupDetail as any).account_groups || []);
    }
  }, [normalizedGroupDetail, reset, isEdit]);

  const handleSave = useCallback(
    async (formData: GroupFormData) => {
      if (!formData.name) {
        alert("Group name is required");
        return;
      }

      if (isEdit && groupId) {
        await updateGroupMutation.mutateAsync({ id: groupId, payload: formData });
        return;
      }

      await createGroupMutation.mutateAsync(formData);
    },
    [createGroupMutation, groupId, isEdit, updateGroupMutation]
  );

  const loadGroupDetail = useCallback((id: string) => {
    setGroupId(id);
  }, []);

  const handleAddRole = useCallback(
    async (roleIds: string[]) => {
      if (!groupId) throw new Error("Group ID is required");

      const promises = roleIds.map((roleId) =>
        addRoleMutation.mutateAsync({
          group: groupId,
          role: roleId,
        })
      );
      await Promise.all(promises);
    },
    [addRoleMutation, groupId]
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
      if (!groupId) throw new Error("Group ID is required");

      const promises = userIds.map((userId) =>
        addUserMutation.mutateAsync({
          account: userId,
          group: groupId,
        })
      );
      await Promise.all(promises);
    },
    [addUserMutation, groupId]
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
    rolesList?.filter(
      (role: any) => !groupRoles.some((gr: any) => gr.roles?.id === role.id)
    ) || [];

  const availableUsers =
    usersList?.filter(
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
    isSaving: createGroupMutation.isPending || updateGroupMutation.isPending,
    handleSave,
    loadGroupDetail,
    handleAddRole,
    handleDeleteRole,
    handleAddUser,
    handleDeleteUser,
    goBack,
  };
}

