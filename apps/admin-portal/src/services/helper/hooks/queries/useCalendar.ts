import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { helperService } from "../../api/helper.service";
import { helperKeys } from "../../query-keys";

type CalendarResponse = Awaited<ReturnType<typeof helperService.getCalendar>>;
type CalendarParams = Parameters<typeof helperService.getCalendar>[0];

export function useCalendar(
  params?: CalendarParams,
  options?: Omit<UseQueryOptions<CalendarResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: helperKeys.calendarList(params as Record<string, unknown> | undefined),
    queryFn: () => helperService.getCalendar(params),
    ...options,
  });
}
