import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import { claimsService } from "@/services/claims/api/claims.service";
import { useChannels } from "@/services/channel/hooks/queries/useChannels";
import { useExportClaims } from "@/services/claims/hooks/queries/useExportClaims";
import AppURL from "@/constants/app-url.const";
import { formatDate } from "@/lib/formatter";
import { DateRange } from "react-day-picker";
import toast from "react-hot-toast";

export function useClaimReport() {
  const router = useRouter();
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [searchChannel, setSearchChannel] = useState(
    "40eee5bf-2b92-4d23-be55-f9caa9d3ea88"
  );
  const [selectedChannel, setSelectedChannel] = useState<any>({
    id: "40eee5bf-2b92-4d23-be55-f9caa9d3ea88",
    name: "Teman",
  });

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Report.Read");
      setHasAccess(access);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const { data: channelsResponse, isLoading: isLoadingChannels } = useChannels(
    {
      limit: 100,
    },
    {
      enabled: hasAccess === true,
      staleTime: 300000,
    }
  );
  const channelsData = (channelsResponse as any)?.data || [];

  const dateFrom = date?.from
    ? formatDate(date.from.toString(), "YYYY-MM-DD")
    : undefined;
  const dateTo = date?.to ? formatDate(date.to.toString(), "YYYY-MM-DD") : undefined;

  const {
    data: claimReportResponse,
    isLoading: isLoadingClaims,
    refetch: refetchClaims,
  } = useExportClaims(
    {
      page,
      limit: rowsPerPage,
      channel_id: selectedChannel?.id,
      output: "Data",
      date_from: dateFrom,
      date_to: dateTo,
    },
    {
      enabled: hasAccess === true && !!date?.from && !!date?.to,
      staleTime: 0,
    }
  );

  const claimReportData = {
    data: (claimReportResponse as any)?.data || [],
    headers:
      ((claimReportResponse as any)?.data || []).length > 0
        ? Object.keys((claimReportResponse as any)?.data[0])
        : [],
    total: (claimReportResponse as any)?.total || 0,
    pageTotal: (claimReportResponse as any)?.pageTotal || 1,
  };

  const handleChannelChange = useCallback(
    (channelId: string) => {
      setSearchChannel(channelId);
      const channel = channelsData?.find((x: any) => x.id === channelId);
      setSelectedChannel(channel);
      setPage(1);
    },
    [channelsData]
  );

  const handleDateChange = useCallback((range: DateRange | undefined) => {
    setDate(range);
    setPage(1);
  }, []);

  const handleClear = useCallback(() => {
    setDate(undefined);
    setPage(1);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const handleDownloadReport = useCallback(async () => {
    try {
      if (!date?.from || !date?.to) {
        toast.error("Please select a date range first");
        return;
      }

      const dateFrom = formatDate(date.from.toString(), "YYYY-MM-DD");
      const dateTo = formatDate(date.to.toString(), "YYYY-MM-DD");

      const params = {
        page,
        limit: rowsPerPage,
        channel_id: selectedChannel?.id,
        output: "File",
        date_from: dateFrom,
        date_to: dateTo,
      };

      const response: any = await claimsService.exportClaims(params);

      if (response?.file) {
        window.location.href = response.file;
        toast.success("Report downloaded successfully!");
      } else {
        toast.error("Failed to download report");
      }
    } catch (error) {
      console.error("Failed to download the report:", error);
      toast.error("Failed to download report. Please try again.");
    }
  }, [date, page, rowsPerPage, selectedChannel]);

  return {
    claims: claimReportData?.data || [],
    headers: claimReportData?.headers || [],
    channels: channelsData || [],
    totalItems: claimReportData?.total || 0,
    totalPages: claimReportData?.pageTotal || 1,

    page,
    rowsPerPage,
    date,
    searchChannel,
    selectedChannel,
    hasAccess,

    isLoadingClaims,
    isLoadingChannels,

    setPage,
    handleChannelChange,
    handleDateChange,
    handleClear,
    handleRowsPerPageChange,
    handleDownloadReport,
  };
}
