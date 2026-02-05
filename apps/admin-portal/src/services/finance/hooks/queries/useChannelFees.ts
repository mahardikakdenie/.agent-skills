import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type ChannelFeesResponse = Awaited<
  ReturnType<typeof financeService.getChannelFees>
>;
type ChannelFeesParams = Parameters<typeof financeService.getChannelFees>[0];

export function useChannelFees(
  params?: ChannelFeesParams,
  options?: Omit<
    UseQueryOptions<ChannelFeesResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: financeKeys.channelFeeList(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => financeService.getChannelFees(params),
    ...options,
  });
}
