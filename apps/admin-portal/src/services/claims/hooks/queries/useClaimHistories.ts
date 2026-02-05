import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ClaimHistoriesResponse = Awaited<
  ReturnType<typeof claimsService.getClaimHistories>
>;
type ClaimHistoriesParams = Parameters<
  typeof claimsService.getClaimHistories
>[0];

export function useClaimHistories(
  params?: ClaimHistoriesParams,
  options?: Omit<
    UseQueryOptions<ClaimHistoriesResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: claimKeys.histories(params as Record<string, unknown> | undefined),
    queryFn: () => claimsService.getClaimHistories(params),
    ...options,
  });
}
