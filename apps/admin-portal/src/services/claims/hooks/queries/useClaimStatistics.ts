import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ClaimStatisticsResponse = Awaited<
  ReturnType<typeof claimsService.getClaimStatistics>
>;
type ClaimStatisticsParams = Parameters<
  typeof claimsService.getClaimStatistics
>[0];

export function useClaimStatistics(
  params?: ClaimStatisticsParams,
  options?: Omit<
    UseQueryOptions<ClaimStatisticsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: claimKeys.statistics(params as Record<string, unknown> | undefined),
    queryFn: () => claimsService.getClaimStatistics(params),
    ...options,
  });
}
