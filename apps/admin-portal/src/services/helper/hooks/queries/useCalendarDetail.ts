import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { helperService } from "../../api/helper.service";
import { helperKeys } from "../../query-keys";

type CalendarDetailResponse = Awaited<
  ReturnType<typeof helperService.getCalendarById>
>;

export function useCalendarDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<CalendarDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: helperKeys.calendarDetail(id),
    queryFn: () => helperService.getCalendarById(id),
    ...options,
  });
}
