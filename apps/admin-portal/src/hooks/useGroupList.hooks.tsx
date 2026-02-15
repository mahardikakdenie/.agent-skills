import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/api/auth.service";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";

export function useGroupList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    data: groupsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["groups", page, rowsPerPage],
    queryFn: async () => {
      const response: any = await authService.getGroups({ page, pageSize: rowsPerPage });
      return response;
    },
    enabled: hasAccess === true,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await authService.deleteGroup(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      alert("Failed to delete group");
    },
  });

  const handleEdit = (id: string) => {
    router.push(`${AppURL.masterdataGroupDetail}/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const addNewGroup = () => {
    router.push(AppURL.masterdataGroupAdd);
  };

  return {
    groups: groupsResponse?.data || [],
    totalPages: groupsResponse?.meta?.pageTotal || 1,
    totalItems: groupsResponse?.meta?.total || 0,
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
    addNewGroup,
    isDeleting: deleteMutation.isPending,
  };
}

