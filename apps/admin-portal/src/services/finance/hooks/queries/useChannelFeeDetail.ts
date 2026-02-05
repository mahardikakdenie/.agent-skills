import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type ChannelFeeDetailResponse = Awaited<
  ReturnType<typeof financeService.getChannelFeeById>
>;

export function useChannelFeeDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<ChannelFeeDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: financeKeys.channelFeeDetail(id),
    queryFn: () => financeService.getChannelFeeById(id),
    ...options,
  });
}
