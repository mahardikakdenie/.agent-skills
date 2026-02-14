import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { reportService } from "../../api/report.service";
import { reportKeys } from "../../query-keys";

type NotificationLogsResponse = Awaited<
  ReturnType<typeof reportService.getNotificationLogs>
>;
type NotificationLogsParams = Parameters<
  typeof reportService.getNotificationLogs
>[0];

export function useNotificationLogs(
  params?: NotificationLogsParams,
  options?: Omit<
    UseQueryOptions<NotificationLogsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: reportKeys.notificationLogsList(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => reportService.getNotificationLogs(params),
    ...options,
  });
}

