import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { UserService } from "@/services/masterdata/user.service";
import { GroupService } from "@/services/masterdata/group.service";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";
import { primaryRoles, countries } from "@/app/masterdata/user/user.const";
import toast from "react-hot-toast";

interface UserFormData {
  id?: string;
  name: string;
  email: string;
  phone_number: string;
  password?: string;
  status: string;
  role: string;
  channel: string;
}

interface UseUserFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;
  setValue: any;
  watch: any;

  userId: string;
  accountId: string;

  channels: any[];
  roleOptions: any[];

  userGroups: any[];
  groupRoles: any[];
  availableGroups: any[];
  availableRoles: any[];

  phoneCode: string;
  status: string;
  showPassword: boolean;

  hasAccess: boolean | null;
  showAlert: boolean;
  alertMessage: string;
  alertType: "success" | "error";
  isEdit: boolean;

  isLoadingDetail: boolean;
  isLoadingChannels: boolean;
  isLoadingGroups: boolean;
  isLoadingRoles: boolean;
  isSaving: boolean;

  setPhoneCode: (code: string) => void;
  setStatus: (status: string) => void;
  setShowPassword: (show: boolean) => void;

  handleSave: (formData: UserFormData) => void;
  handleGeneratePassword: () => void;
  copyPassword: () => void;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
  loadUserDetail: (id: string) => void;

  handleAddGroup: (groupIds: string[]) => Promise<void>;
  handleDeleteGroup: (groupId: string) => Promise<void>;

  handleAddRole: (roleIds: string[]) => Promise<void>;
  handleDeleteRole: (roleId: string) => Promise<void>;

  getStatusColor: (status: string) => string;
}

export function useUserForm(
  mode: "create" | "edit" = "create"
): UseUserFormProps {
  const router = useRouter();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();
  const userService = new UserService();
  const groupService = new GroupService();
  const isEdit = mode === "edit";

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    shouldUnregister: false,
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      password: "",
      status: "",
      role: "",
      channel: "",
    },
  });

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [userId, setUserId] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");

  const [phoneCode, setPhoneCode] = useState(countries[0].code);
  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [groupRoles, setGroupRoles] = useState<any[]>([]);

  useEffect(() => {
    const checkAccess = async () => {
      const requiredPermission = isEdit
        ? "Masterdata.Update"
        : "Masterdata.Create";
      const access = permissionList.includes(requiredPermission);
      setHasAccess(access);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList, isEdit]);

  const { data: channels, isLoading: isLoadingChannels } = useQuery({
    queryKey: ["user-channels"],
    queryFn: async () => {
      const response = await userService.getChannel({});
      return response || [];
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const { data: userDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["user-detail", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await userService.getUserById(userId);
      return response;
    },
    enabled: isEdit && !!userId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const { data: groupsData, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["available-groups"],
    queryFn: async () => {
      const response = await groupService.getGroup(1, 100);
      return response;
    },
    enabled: isEdit && !!accountId,
    staleTime: 300000,
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["available-roles"],
    queryFn: async () => {
      const response = await groupService.getRoles(1, 100);
      return response;
    },
    enabled: isEdit && !!accountId,
    staleTime: 300000,
  });

  useEffect(() => {
    if (userDetail && isEdit) {
      const formData = {
        name: userDetail.name || "",
        email: userDetail.email || "",
        phone_number: userDetail.phone_number?.slice(3) || "",
        password: userDetail.password || "",
        status: userDetail.status || "",
        role: userDetail.role || "",
        channel: userDetail.channel || "",
      };

      reset(formData);

      setTimeout(() => {
        const currentChannel = watch("channel");

        if (currentChannel !== userDetail.channel) {
          setValue("channel", userDetail.channel, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
      }, 200);

      setPhoneCode(userDetail.phone_number?.slice(0, 3) || countries[0].code);
      setStatus(userDetail.status || "");
      setAccountId(userDetail.id);
      setUserGroups(userDetail.account_groups || []);
      setGroupRoles(userDetail.account_roles || []);
    }
  }, [userDetail, reset, isEdit, setValue, watch]);

  const saveMutation = useMutation({
    mutationFn: async (payload: UserFormData & { phone_number: string }) => {
      if (isEdit) {
        await userService.updateUser(payload, userId);
        return { id: userId };
      } else {
        const response = await userService.saveUser(payload);
        return response;
      }
    },
    onSuccess: (data) => {
      toast.success(
        isEdit ? "User Updated Successfully!" : "User Created Successfully!"
      );

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.removeQueries({ queryKey: ["user-detail"] });

      if (isEdit) {
        router.push(AppURL.masterdataUser);
      } else if (data?.id) {
        router.push(`${AppURL.masterdataUserDetail}/${data.id}`);
      }
    },
    onError: (error: any) => {
      console.error("Failed to save user:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save user. Please try again."
      );
    },
  });

  const addGroupMutation = useMutation({
    mutationFn: async (groupIds: string[]) => {
      const results = [];
      for (const groupId of groupIds) {
        const response = await userService.addAccountGroups({
          account: accountId,
          group: groupId,
        });
        results.push(response);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-detail", userId] });
      toast.success("Groups added successfully");
    },
    onError: (error) => {
      console.error("Failed to add groups:", error);
      toast.error("Failed to add groups");
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      await userService.removeAccountGroups(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-detail", userId] });
      toast.success("Group removed successfully");
    },
    onError: (error) => {
      console.error("Failed to remove group:", error);
      toast.error("Failed to remove group");
    },
  });

  const addRoleMutation = useMutation({
    mutationFn: async (roleIds: string[]) => {
      const results = [];
      for (const roleId of roleIds) {
        const response = await userService.addAccountRoles({
          account: accountId,
          role: roleId,
        });
        results.push(response);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-detail", userId] });
      toast.success("Roles added successfully");
    },
    onError: (error) => {
      console.error("Failed to add roles:", error);
      toast.error("Failed to add roles");
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      await userService.removeAccountRoles(roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-detail", userId] });
      toast.success("Role removed successfully");
    },
    onError: (error) => {
      console.error("Failed to remove role:", error);
      toast.error("Failed to remove role");
    },
  });

  const handleSave = useCallback(
    async (formData: UserFormData) => {
      setAlertMessage("");
      setShowAlert(false);

      if (
        !formData.name ||
        !formData.email ||
        !formData.status ||
        !formData.role ||
        !formData.channel
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const payload = {
        ...formData,
        phone_number: `${phoneCode}${formData.phone_number}`,
      };

      if (payload.role !== "Admin" && !payload.password?.trim()) {
        delete payload.password;
      }

      saveMutation.mutate(payload);
    },
    [saveMutation, phoneCode]
  );

  const handleGeneratePassword = useCallback(() => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+\\-=[]{};\\':\"|,.<>/?~`";

    const allChars = uppercase + lowercase + numbers + specialChars;

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    for (let i = password.length; i < 8; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    const shuffled = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    setValue("password", shuffled);
  }, [setValue]);

  const copyPassword = useCallback(() => {
    const password = watch("password");
    if (!password) {
      toast.error("No password to copy");
      return;
    }
    navigator.clipboard
      .writeText(password)
      .then(() => toast.success("Password copied!"))
      .catch(() => toast.error("Failed to copy password"));
  }, [watch]);

  const goBack = useCallback(() => {
    if (isEdit) {
      router.push(AppURL.masterdataUser);
    } else {
      router.back();
    }
  }, [router]);

  const loadUserDetail = useCallback((id: string) => {
    setUserId(id);
  }, []);

  const handleAddGroup = useCallback(
    async (groupIds: string[]) => {
      await addGroupMutation.mutateAsync(groupIds);
    },
    [addGroupMutation]
  );

  const handleDeleteGroup = useCallback(
    async (groupId: string) => {
      if (window.confirm("Are you sure you want to remove this group?")) {
        await deleteGroupMutation.mutateAsync(groupId);
      }
    },
    [deleteGroupMutation]
  );

  const handleAddRole = useCallback(
    async (roleIds: string[]) => {
      await addRoleMutation.mutateAsync(roleIds);
    },
    [addRoleMutation]
  );

  const handleDeleteRole = useCallback(
    async (roleId: string) => {
      if (window.confirm("Are you sure you want to remove this role?")) {
        await deleteRoleMutation.mutateAsync(roleId);
      }
    },
    [deleteRoleMutation]
  );

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Inactive":
        return "text-gray-400 font-normal";
      case "Active":
        return "text-[#00AB4F]";
      default:
        return "text-[#7B5D21]";
    }
  }, []);

  const normalizedChannels = Array.isArray((channels as any)?.data)
    ? (channels as any).data
    : Array.isArray(channels)
      ? channels
      : [];

  return {
    handleSubmit,
    control,
    errors,
    reset,
    setValue,
    watch,

    userId,
    accountId,

    channels: normalizedChannels,
    roleOptions: primaryRoles,

    userGroups,
    groupRoles,
    availableGroups: groupsData?.data || [],
    availableRoles: rolesData?.data || [],

    phoneCode,
    status,
    showPassword,

    hasAccess,
    showAlert,
    alertMessage,
    alertType,
    isEdit,

    isLoadingDetail,
    isLoadingChannels,
    isLoadingGroups,
    isLoadingRoles,
    isSaving:
      saveMutation.isPending ||
      addGroupMutation.isPending ||
      deleteGroupMutation.isPending ||
      addRoleMutation.isPending ||
      deleteRoleMutation.isPending,

    setPhoneCode,
    setStatus,
    setShowPassword,

    handleSave,
    handleGeneratePassword,
    copyPassword,
    setShowAlert,
    goBack,
    loadUserDetail,

    handleAddGroup,
    handleDeleteGroup,
    handleAddRole,
    handleDeleteRole,

    getStatusColor,
  };
}
