import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ClaimDetailResponse = Awaited<
  ReturnType<typeof claimsService.getClaimById>
>;

export function useClaimDetail(
  id: string,
  options?: Omit<UseQueryOptions<ClaimDetailResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: claimKeys.detail(id),
    queryFn: () => claimsService.getClaimById(id),
    ...options,
  });
}
