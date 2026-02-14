import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ClaimsResponse = Awaited<ReturnType<typeof claimsService.getClaims>>;
type ClaimsParams = Parameters<typeof claimsService.getClaims>[0];

export function useClaims(
  params?: ClaimsParams,
  options?: Omit<UseQueryOptions<ClaimsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: claimKeys.list(
      params as unknown as Record<string, unknown> | undefined
    ),
    queryFn: () => claimsService.getClaims(params),
    ...options,
  });
}
