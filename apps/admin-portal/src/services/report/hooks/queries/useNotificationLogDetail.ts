import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { reportService } from "../../api/report.service";
import { reportKeys } from "../../query-keys";

type NotificationLogDetailResponse = Awaited<
  ReturnType<typeof reportService.getNotificationLogById>
>;

export function useNotificationLogDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<NotificationLogDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: reportKeys.notificationLogDetail(id),
    queryFn: () => reportService.getNotificationLogById(id),
    ...options,
  });
}

