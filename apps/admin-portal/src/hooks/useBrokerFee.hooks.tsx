import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import _ from "lodash";

import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import { financeService } from "@/services/finance/api/finance.service";

interface BrokerFeeItem {
  id: string;
  insurance: string;
  insurance_name: string;
  product: string;
  product_name: string;
  plan: string;
  plan_name: string;
  fee: number;
  fee_type: string;
  currency: string;
  broker: string;
  created_at: string;
  updated_at?: string;
}

interface UseBrokerFeeProps {
  brokerFees: BrokerFeeItem[];
  filteredBrokerFees: BrokerFeeItem[];
  totalPages: number;
  totalItems: number;

  page: number;
  rowsPerPage: number;
  searchTerm: string;

  hasAccess: boolean | null;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setSearchTerm: (search: string) => void;

  isLoading: boolean;
  isError: boolean;
  error: any;
  isDeleting: boolean;

  refetch: () => void;
  handleSearch: () => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  addNewBrokerFee: () => void;
}

export function useBrokerFee(): UseBrokerFeeProps {
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

  const setSearchTerm = useMemo(
    () =>
      _.debounce((keyword: string) => {
        setSearchTermState(keyword);
        setPageState(1);
      }, 300),
    []
  );

  const {
    data: brokerFeeResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["broker-fees", page, rowsPerPage, searchTerm],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        pageSize: rowsPerPage,
      };

      if (searchTerm) {
        params.keyword = searchTerm;
      }

      const response = await financeService.getBrokerFees(params);
      return response;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await financeService.deleteBrokerFee(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["broker-fees"] });
    },
    onError: (error) => {
      console.error("Failed to delete broker fee:", error);
      alert("Failed to delete broker fee");
    },
  });

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Finance.Broker Fee.Read");
      const editBtn = permissionList.includes("Finance.Broker Fee.Update");
      const deleteBtn = permissionList.includes("Finance.Broker Fee.Delete");
      const createBtn = permissionList.includes("Finance.Broker Fee.Create");

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

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`${AppURL.financeBrokerFeeDetail}/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this broker fee?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const addNewBrokerFee = useCallback(() => {
    router.push(AppURL.financeBrokerFeeAdd);
  }, [router]);

  const brokerFeeData: any = brokerFeeResponse;

  return {
    brokerFees: brokerFeeData?.data || [],
    filteredBrokerFees: brokerFeeData?.data || [],
    totalPages: Math.ceil((brokerFeeData?.meta?.total || 0) / rowsPerPage),
    totalItems: brokerFeeData?.meta?.total || 0,

    page,
    rowsPerPage,
    searchTerm,

    hasAccess,
    canEdit,
    canCreate,
    canDelete,

    setPage,
    setRowsPerPage,
    setSearchTerm,

    isLoading,
    isError,
    error,
    isDeleting: deleteMutation.isPending,

    refetch,
    handleSearch,
    handleEdit,
    handleDelete,
    addNewBrokerFee,
  };
}
