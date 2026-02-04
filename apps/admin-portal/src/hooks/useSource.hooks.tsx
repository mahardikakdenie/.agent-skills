import React, { useState, useCallback, useEffect, useMemo } from "react";
import _ from "lodash";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";
import { sanctionService } from "@/services/api.service";

interface SourceItem {
  id: string;
  source_name: string;
  source_type: string;
  source_url: string;
  insurance_name: string;
  created_at: string;
  updated_at?: string;
  insurance_id?: string;
}

interface UseSourceProps {
  sources: SourceItem[];
  filteredSources: SourceItem[];
  totalPages: number;
  totalItems: number;
  selectedSource: SourceItem | null;

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
  handleSearch: (keyword: string) => void;
  handleViewDetail: (id: string) => void;
  handleEditSource: (id: string) => void;
  handleDelete: (id: string) => void;
  addNewSource: () => void;
}

export function useSource(): UseSourceProps {
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

  const [selectedSource, setSelectedSource] = useState<SourceItem | null>(null);
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
    data: sourceResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sources", page, rowsPerPage, searchTerm],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        limit: rowsPerPage,
      };

      if (searchTerm) {
        params.keyword = searchTerm;
      }

      const response = await sanctionService.get(ApiURL.v1SourcesPaging, {
        params,
      });
      return response.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await sanctionService.delete(ApiURL.v1SourcesDeleteDetails(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources"] });
      queryClient.invalidateQueries({ queryKey: ["source-detail"] });
    },
    onError: (error) => {
      console.error("Failed to delete source:", error);
    },
  });

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Source.Source List.Read");
      const editBtn = permissionList.includes("Source.Source List.Update");
      const deleteBtn = permissionList.includes("Source.Source List.Delete");
      const createBtn = permissionList.includes("Source.Source List.Create");

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

  const handleSearch = useMemo(
    () =>
      _.debounce((keyword: string) => {
        setSearchTermState(keyword);
        setPageState(1);
      }, 300),
    []
  );

  const handleViewDetail = useCallback(async (id: string) => {
    try {
      const res = await sanctionService.get(ApiURL.v1SourcesDetails(id));
      const response = res.data;
      const sourceData = response.data[0];
      setSelectedSource(sourceData);
      setDrawerOpen(true);
    } catch (err) {
      console.error("Failed to fetch source details:", err);
    }
  }, []);

  const handleEditSource = useCallback(
    (id: string) => {
      router.push(`${AppURL.sourceDetail}/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this source?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const addNewSource = useCallback(() => {
    router.push(AppURL.sourceAdd);
  }, [router]);

  return {
    sources: sourceResponse?.data || [],
    filteredSources: sourceResponse?.data || [],
    totalPages: sourceResponse?.pageTotal || 1,
    totalItems: sourceResponse?.total || 0,
    selectedSource,

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
    handleEditSource,
    handleDelete,
    addNewSource,
  };
}
