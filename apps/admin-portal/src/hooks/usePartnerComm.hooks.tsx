import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import _ from "lodash";

import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import { useChannelsV1 } from "@/services/channel/hooks/queries";
import { useChannelFees } from "@/services/finance/hooks/queries";
import { useDeleteChannelFee } from "@/services/finance/hooks/mutations";

interface PartnerCommItem {
  id: string;
  channel: string;
  channel_name: string;
  insurance: string | null;
  insurance_name: string;
  product: string | null;
  product_name: string | null;
  plan: string | null;
  plan_name: string | null;
  fee: number;
  fee_type: string;
  currency: string;
  created_at: string;
  updated_at?: string;
}

interface Channel {
  id: string;
  name: string;
}

interface UsePartnerCommProps {
  partnerComms: PartnerCommItem[];
  channels: Channel[];
  totalPages: number;
  totalItems: number;

  page: number;
  rowsPerPage: number;
  searchTerm: string;
  selectedChannel: string;

  hasAccess: boolean | null;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;

  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setSearchTerm: (search: string) => void;
  setSelectedChannel: (channelId: string) => void;

  isLoading: boolean;
  isLoadingChannels: boolean;
  isError: boolean;
  error: any;
  isDeleting: boolean;

  refetch: () => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  addNewPartnerComm: () => void;
}

export function usePartnerComm(): UsePartnerCommProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { permissionList } = useAuth();

  const [page, setPageState] = useState(() => {
    return parseInt(searchParams.get("page") || "1", 10);
  });

  const [rowsPerPage, setRowsPerPageState] = useState(() => {
    return parseInt(searchParams.get("limit") || "10", 10);
  });

  const [searchTerm, setSearchTermState] = useState("");
  const [selectedChannel, setSelectedChannelState] = useState("All");

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

  const setSearchTerm = _.debounce((keyword: string) => {
    setSearchTermState(keyword);
  }, 300);

  const setSelectedChannel = useCallback((channelId: string) => {
    setSelectedChannelState(channelId);
    setPageState(1);
  }, []);

  const { data: channelsResponse, isLoading: isLoadingChannels } = useChannelsV1(
    {
      page: 1,
      limit: 100,
    },
    {
      staleTime: 300000,
      refetchOnWindowFocus: false,
    }
  );
  const channelsData = (channelsResponse as any)?.data || [];

  const {
    data: partnerCommResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useChannelFees(
    {
      page,
      pageSize: rowsPerPage,
      ...(selectedChannel !== "All" ? { channelId: selectedChannel } : {}),
      ...(searchTerm ? { keyword: searchTerm } : {}),
    },
    {
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  const deleteMutation = useDeleteChannelFee({
    onError: (error) => {
      console.error("Failed to delete partner comm:", error);
      alert("Failed to delete partner comm");
    },
  });

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Finance.Partner Comm.Read");
      const editBtn = permissionList.includes("Finance.Partner Comm.Update");
      const deleteBtn = permissionList.includes("Finance.Partner Comm.Delete");
      const createBtn = permissionList.includes("Finance.Partner Comm.Create");

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

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`${AppURL.financePartnerCommDetail}/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        window.confirm("Are you sure you want to delete this partner comm?")
      ) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const addNewPartnerComm = useCallback(() => {
    router.push(AppURL.financePartnerCommAdd);
  }, [router]);

  const partnerCommData: any = partnerCommResponse;

  return {
    partnerComms: partnerCommData?.data || [],
    channels: channelsData || [],
    totalPages: Math.ceil(
      (partnerCommData?.meta?.total || 0) / rowsPerPage
    ),
    totalItems: partnerCommData?.meta?.total || 0,

    page,
    rowsPerPage,
    searchTerm,
    selectedChannel,

    hasAccess,
    canEdit,
    canCreate,
    canDelete,

    setPage,
    setRowsPerPage,
    setSearchTerm,
    setSelectedChannel,

    isLoading,
    isLoadingChannels,
    isError,
    error,
    isDeleting: deleteMutation.isPending,

    refetch,
    handleEdit,
    handleDelete,
    addNewPartnerComm,
  };
}
