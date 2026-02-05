import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ClaimListLimitResponse = Awaited<
  ReturnType<typeof claimsService.getClaimListLimit>
>;
type ClaimListLimitParams = Parameters<typeof claimsService.getClaimListLimit>[0];

export function useClaimListLimit(
  params?: ClaimListLimitParams,
  options?: Omit<
    UseQueryOptions<ClaimListLimitResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: claimKeys.listLimit(params as Record<string, unknown> | undefined),
    queryFn: () => claimsService.getClaimListLimit(params),
    ...options,
  });
}
