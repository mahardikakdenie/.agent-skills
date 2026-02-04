import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RoleService } from "@/services/masterdata/roles.service";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";

export function useRole() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const roleService = new RoleService();
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPageState] = useState(10);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Read");
      const editBtn = permissionList.includes("Masterdata.Update");
      const deleteBtn = permissionList.includes("Masterdata.Delete");
      const createBtn = permissionList.includes("Masterdata.Create");

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const {
    data: rolesResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["roles", page, rowsPerPage],
    queryFn: async () => {
      const response = await roleService.getRole(page, rowsPerPage);
      return response;
    },
    enabled: hasAccess === true,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await roleService.deleteRole(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      alert("Failed to delete role");
    },
  });

  const handleEdit = (id: string) => {
    router.push(`${AppURL.masterdataRoleDetail}/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const addNewRole = () => {
    router.push(AppURL.masterdataRoleAdd);
  };

  const setRowsPerPage = useCallback((newRowsPerPage: number) => {
    setRowsPerPageState(newRowsPerPage);
    setPage(1);
  }, []);

  return {
    roles: rolesResponse?.data || [],
    totalPages: rolesResponse?.meta?.pageTotal || 1,
    totalItems: rolesResponse?.meta?.total || 0,
    page,
    rowsPerPage,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading: isLoading || hasAccess === null,
    isError,
    error,
    setPage,
    setRowsPerPage,
    handleEdit,
    handleDelete,
    addNewRole,
    isDeleting: deleteMutation.isPending,
  };
}
