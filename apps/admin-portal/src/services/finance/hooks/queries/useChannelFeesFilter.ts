import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type ChannelFeesFilterResponse = Awaited<
  ReturnType<typeof financeService.getChannelFeesFilter>
>;
type ChannelFeesFilterParams = Parameters<
  typeof financeService.getChannelFeesFilter
>[0];

export function useChannelFeesFilter(
  params?: ChannelFeesFilterParams,
  options?: Omit<
    UseQueryOptions<ChannelFeesFilterResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: financeKeys.channelFeesFilter(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => financeService.getChannelFeesFilter(params),
    ...options,
  });
}
