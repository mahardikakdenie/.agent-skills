import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { UserService } from "@/services/masterdata/user.service";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";
import { primaryRoles } from "@/app/masterdata/user/user.const";
import _ from "lodash";

interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface UseUserProps {
  users: User[];
  totalPages: number;
  totalItems: number;

  page: number;
  rowsPerPage: number;
  roleFilter: string;
  searchQuery: string;

  roleOptions: any[];
  selectedUserStatus: User | undefined;
  isModalChangeStatusOpen: boolean;

  hasAccess: boolean | null;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canToggleStatus: boolean;
  canSearchAllAccount: boolean;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setRoleFilter: (role: string) => void;
  setSearchQuery: (query: string) => void;
  setIsModalChangeStatusOpen: (open: boolean) => void;

  isLoading: boolean;
  isError: boolean;
  error: any;

  refetch: () => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleStatusChange: (user: User) => void;
  handleUpdateStatus: () => void;
  addNewUser: () => void;
}

export function useUsers(): UseUserProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();
  const userService = useMemo(() => new UserService(), []);

  const [page, setPageState] = useState(() => {
    return parseInt(searchParams.get("page") || "1", 10);
  });

  const [rowsPerPage, setRowsPerPageState] = useState(() => {
    return parseInt(searchParams.get("limit") || "10", 10);
  });

  const [roleFilter, setRoleFilterState] = useState(() => {
    return searchParams.get("role") || "User";
  });

  const [searchQuery, setSearchQueryState] = useState("");

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [canToggleStatus, setCanToggleStatus] = useState<boolean>(false);
  const [canSearchAllAccount, setCanSearchAllAccount] =
    useState<boolean>(false);

  const [selectedUserStatus, setSelectedUserStatus] = useState<User>();
  const [isModalChangeStatusOpen, setIsModalChangeStatusOpen] = useState(false);

  const updateURL = useCallback(
    (params: Record<string, string | number | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          current.set(key, String(value));
        } else {
          current.delete(key);
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setPage = useCallback(
    (newPage: number) => {
      setPageState(newPage);
      updateURL({ page: newPage });
    },
    [updateURL]
  );

  const setRowsPerPage = useCallback(
    (newRowsPerPage: number) => {
      setRowsPerPageState(newRowsPerPage);
      setPageState(1);
      updateURL({ limit: newRowsPerPage, page: 1 });
    },
    [updateURL]
  );

  const setRoleFilter = useCallback(
    (newRole: string) => {
      setRoleFilterState(newRole);
      setPageState(1);
      updateURL({ role: newRole, page: 1 });
    },
    [updateURL]
  );

  const setSearchQuery = useCallback(
    _.debounce((keyword: string) => {
      setSearchQueryState(keyword);
    }, 500),
    []
  );

  useEffect(() => {
    const checkAccess = async () => {
      const access =
        permissionList.includes("Masterdata.Read") ||
        permissionList.includes("Userdata.Read");
      const editBtn = permissionList.includes("Masterdata.Update");
      const deleteBtn = permissionList.includes("Masterdata.Delete");
      const createBtn = permissionList.includes("Masterdata.Create");
      const toggleStatus = permissionList.includes("User.Change Status");
      const searchAll = permissionList.includes("Profiles.AdminReadProfiles");

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);
      setCanToggleStatus(toggleStatus);
      setCanSearchAllAccount(searchAll);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const {
    data: userResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", page, rowsPerPage, roleFilter, searchQuery],
    queryFn: async () => {
      const result = await userService.getUser(
        roleFilter,
        page,
        rowsPerPage,
        searchQuery
      );
      return result;
    },
    enabled: !!hasAccess,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { data: roleOptionsData } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const allRoles = await userService.getRole({ page: 1, pageSize: 1000 });
      const seen = new Set(primaryRoles.map((item) => item.name));
      const options = [...primaryRoles];

      for (const item of allRoles.data) {
        if (!seen.has(item.name)) {
          seen.add(item.name);
          options.push(item);
        }
      }
      return options;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await userService.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      console.error("Failed to delete user:", error);
      alert(error?.response?.data?.message || "Failed to delete user");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (user: User) => {
      const { id, ...otherData } = user;
      const data = {
        ...otherData,
        status: user.status === "Active" ? "Inactive" : "Active",
      };
      await userService.updateUser(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalChangeStatusOpen(false);
    },
    onError: (error: any) => {
      console.error("Failed to update status:", error);
      alert(error?.message || "Failed to update status");
    },
  });

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`${AppURL.masterdataUserDetail}/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this user?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const handleStatusChange = useCallback((user: User) => {
    setSelectedUserStatus(user);
    setIsModalChangeStatusOpen(true);
  }, []);

  const handleUpdateStatus = useCallback(async () => {
    if (selectedUserStatus) {
      updateStatusMutation.mutate(selectedUserStatus);
    }
  }, [selectedUserStatus, updateStatusMutation]);

  const addNewUser = useCallback(() => {
    router.push(AppURL.masterdataUserAdd);
  }, [router]);

  return {
    users: userResponse?.data || [],
    totalPages: userResponse?.meta?.pageTotal || 1,
    totalItems: userResponse?.meta?.total || 0,

    page,
    rowsPerPage,
    roleFilter,
    searchQuery,

    roleOptions: roleOptionsData || [],
    selectedUserStatus,
    isModalChangeStatusOpen,

    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    canToggleStatus,
    canSearchAllAccount,

    setPage,
    setRowsPerPage,
    setRoleFilter,
    setSearchQuery,
    setIsModalChangeStatusOpen,

    isLoading,
    isError,
    error,

    refetch,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleUpdateStatus,
    addNewUser,
  };
}
