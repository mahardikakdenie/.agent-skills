import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { channelService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";

interface Channel {
  id: string;
  name: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

interface UseChannelProps {
  channels: Channel[];
  totalPages: number;
  totalItems: number;

  page: number;
  rowsPerPage: number;

  hasAccess: boolean | null;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;

  isLoading: boolean;
  isError: boolean;
  error: any;

  refetch: () => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  addNewChannel: () => void;
}

export function useChannel(): UseChannelProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPageState] = useState(() => {
    return parseInt(searchParams.get("page") || "1", 10);
  });

  const [rowsPerPage, setRowsPerPageState] = useState(() => {
    return parseInt(searchParams.get("limit") || "10", 10);
  });

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

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
    data: channelResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["channels", page, rowsPerPage],
    queryFn: async () => {
      const res: any = await channelService.get(ApiURL.v1Channels, {
        params: { page, limit: rowsPerPage },
      });
      return res.data;
    },
    enabled: !!hasAccess,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await channelService.delete(ApiURL.v1ChannelDetails(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
    onError: (error) => {
      console.error("Failed to delete channel:", error);
      alert("Failed to delete channel");
    },
  });

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`${AppURL.masterdataChannelDetail}/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this channel?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const addNewChannel = useCallback(() => {
    router.push(AppURL.masterdataChannelAdd);
  }, [router]);

  return {
    channels: channelResponse?.data || [],
    totalPages: channelResponse?.pageTotal || 1,
    totalItems: channelResponse?.total || 0,

    page,
    rowsPerPage,

    hasAccess,
    canEdit,
    canCreate,
    canDelete,

    setPage,
    setRowsPerPage,

    isLoading,
    isError,
    error,

    refetch,
    handleEdit,
    handleDelete,
    addNewChannel,
  };
}
