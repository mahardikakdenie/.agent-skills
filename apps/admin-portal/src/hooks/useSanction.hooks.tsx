import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import { sanctionService } from "@/services/sanction/api/sanction.service";

interface SanctionItem {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  blacklist_reason: string;
  date_blacklisted: string;
  created_at: string;
  updated_at?: string;
  id_number?: string;
}

interface UseSanctionProps {
  sanctions: SanctionItem[];
  filteredSanctions: SanctionItem[];
  totalPages: number;
  totalItems: number;
  selectedSanction: SanctionItem | null;

  page: number;
  rowsPerPage: number;
  searchTerm: string;

  drawerOpen: boolean;
  hasAccess: boolean | null;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setSearchTerm: (search: string) => void;
  setDrawerOpen: (open: boolean) => void;

  isLoading: boolean;
  isError: boolean;
  error: any;
  isDeleting: boolean;

  refetch: () => void;
  handleSearch: () => void;
  handleViewDetail: (id: string) => void;
  handleEditSanction: (id: string) => void;
  handleDelete: (id: string) => void;
  addNewSanction: () => void;
  uploadSanction: () => void;
}

export function useSanction(): UseSanctionProps {
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

  const [searchTerm, setSearchTermState] = useState("");

  const [selectedSanction, setSelectedSanction] = useState<SanctionItem | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const setSearchTerm = useCallback((newSearchTerm: string) => {
    setSearchTermState(newSearchTerm);
  }, []);

  const {
    data: sanctionResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sanctions", page, rowsPerPage, searchTerm],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        limit: rowsPerPage,
      };

      if (searchTerm) {
        params.keyword = searchTerm;
      }

      const response = await sanctionService.getBlacklist(params);
      return response;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await sanctionService.deleteBlacklist(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sanctions"] });
      queryClient.invalidateQueries({ queryKey: ["sanction-detail"] });
    },
    onError: (error) => {
      console.error("Failed to delete sanction:", error);
    },
  });

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Sanction.Read");
      const editBtn = permissionList.includes("Sanction.Update");
      const deleteBtn = permissionList.includes("Sanction.Delete");
      const createBtn = permissionList.includes("Sanction.Create");

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

  const handleSearch = useCallback(() => {
    setPageState(1);
    refetch();
  }, [refetch]);

  const handleViewDetail = useCallback(async (id: string) => {
    try {
      const response: any = await sanctionService.getBlacklistById(id);
      const sanctionData = response?.data?.[0];
      setSelectedSanction(sanctionData);
      setDrawerOpen(true);
    } catch (err) {
      console.error("Failed to fetch sanction details:", err);
    }
  }, []);

  const handleEditSanction = useCallback(
    (id: string) => {
      router.push(`${AppURL.sanctionDetail}/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this sanction?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const addNewSanction = useCallback(() => {
    router.push(AppURL.sanctionAdd);
  }, [router]);

  const uploadSanction = useCallback(() => {
    router.push(AppURL.sanctionUpload);
  }, [router]);

  const sanctionsData: any = sanctionResponse;

  return {
    sanctions: sanctionsData?.data || [],
    filteredSanctions: sanctionsData?.data || [],
    totalPages: sanctionsData?.pageTotal || 1,
    totalItems: sanctionsData?.total || 0,
    selectedSanction,

    page,
    rowsPerPage,
    searchTerm,

    drawerOpen,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,

    setPage,
    setRowsPerPage,
    setSearchTerm,
    setDrawerOpen,

    isLoading,
    isError,
    error,
    isDeleting: deleteMutation.isPending,

    refetch,
    handleSearch,
    handleViewDetail,
    handleEditSanction,
    handleDelete,
    addNewSanction,
    uploadSanction,
  };
}
