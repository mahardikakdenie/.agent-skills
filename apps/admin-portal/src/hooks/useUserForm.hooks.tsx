import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import AppURL from "@/constants/app-url.const";
import { primaryRoles, countries } from "@/app/masterdata/user/user.const";
import toast from "react-hot-toast";
import {
  useAccountDetail,
  useGroups,
  useRoles,
} from "@/services/auth/hooks/queries";
import {
  useAddAccountGroup,
  useAddAccountRole,
  useCreateAccount,
  useRemoveAccountGroup,
  useRemoveAccountRole,
  useUpdateAccount,
} from "@/services/auth/hooks/mutations";
import { useChannelsV1 } from "@/services/channel/hooks/queries";

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

  const { data: channels, isLoading: isLoadingChannels } = useChannelsV1(
    { limit: 1000 },
    {
      staleTime: 300000,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: userDetail,
    isLoading: isLoadingDetail,
    refetch: refetchUserDetail,
  } = useAccountDetail(userId, {
    enabled: isEdit && !!userId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const { data: groupsData, isLoading: isLoadingGroups } = useGroups(
    { page: 1, pageSize: 100 },
    {
      enabled: isEdit && !!accountId,
      staleTime: 300000,
    }
  );

  const { data: rolesData, isLoading: isLoadingRoles } = useRoles(
    { page: 1, pageSize: 100 },
    {
      enabled: isEdit && !!accountId,
      staleTime: 300000,
    }
  );

  const normalizedUserDetail = (userDetail as any)?.data || userDetail;

  useEffect(() => {
    if (normalizedUserDetail && isEdit) {
      const formData = {
        name: (normalizedUserDetail as any).name || "",
        email: (normalizedUserDetail as any).email || "",
        phone_number: (normalizedUserDetail as any).phone_number?.slice(3) || "",
        password: (normalizedUserDetail as any).password || "",
        status: (normalizedUserDetail as any).status || "",
        role: (normalizedUserDetail as any).role || "",
        channel: (normalizedUserDetail as any).channel || "",
      };

      reset(formData);

      setTimeout(() => {
        const currentChannel = watch("channel");

        if (currentChannel !== (normalizedUserDetail as any).channel) {
          setValue("channel", (normalizedUserDetail as any).channel, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
      }, 200);

      setPhoneCode(
        (normalizedUserDetail as any).phone_number?.slice(0, 3) ||
          countries[0].code
      );
      setStatus((normalizedUserDetail as any).status || "");
      setAccountId((normalizedUserDetail as any).id);
      setUserGroups((normalizedUserDetail as any).account_groups || []);
      setGroupRoles((normalizedUserDetail as any).account_roles || []);
    }
  }, [normalizedUserDetail, reset, isEdit, setValue, watch]);

  const createUserMutation = useCreateAccount({
    onSuccess: (data: any) => {
      toast.success("User Created Successfully!");

      const createdId = data?.id || data?.data?.id;
      if (createdId) {
        router.push(`${AppURL.masterdataUserDetail}/${createdId}`);
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

  const updateUserMutation = useUpdateAccount({
    onSuccess: () => {
      toast.success("User Updated Successfully!");
      router.push(AppURL.masterdataUser);
    },
    onError: (error: any) => {
      console.error("Failed to save user:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save user. Please try again."
      );
    },
  });

  const addGroupMutation = useAddAccountGroup({
    onError: (error) => {
      console.error("Failed to add groups:", error);
      toast.error("Failed to add groups");
    },
  });

  const deleteGroupMutation = useRemoveAccountGroup({
    onSuccess: () => {
      refetchUserDetail();
      toast.success("Group removed successfully");
    },
    onError: (error) => {
      console.error("Failed to remove group:", error);
      toast.error("Failed to remove group");
    },
  });

  const addRoleMutation = useAddAccountRole({
    onError: (error) => {
      console.error("Failed to add roles:", error);
      toast.error("Failed to add roles");
    },
  });

  const deleteRoleMutation = useRemoveAccountRole({
    onSuccess: () => {
      refetchUserDetail();
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

      if (isEdit) {
        updateUserMutation.mutate({ id: userId, payload });
        return;
      }

      createUserMutation.mutate(payload);
    },
    [createUserMutation, isEdit, phoneCode, updateUserMutation, userId]
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
      for (const groupId of groupIds) {
        await addGroupMutation.mutateAsync({
          account: accountId,
          group: groupId,
        });
      }
      refetchUserDetail();
      toast.success("Groups added successfully");
    },
    [accountId, addGroupMutation, refetchUserDetail]
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
      for (const roleId of roleIds) {
        await addRoleMutation.mutateAsync({
          account: accountId,
          role: roleId,
        });
      }
      refetchUserDetail();
      toast.success("Roles added successfully");
    },
    [accountId, addRoleMutation, refetchUserDetail]
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
    availableGroups: (groupsData as any)?.data || [],
    availableRoles: (rolesData as any)?.data || [],

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
      createUserMutation.isPending ||
      updateUserMutation.isPending ||
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

