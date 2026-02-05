import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ClaimConfigurationsResponse = Awaited<
  ReturnType<typeof claimsService.getConfigurations>
>;

export function useClaimConfigurations(
  options?: Omit<
    UseQueryOptions<ClaimConfigurationsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: claimKeys.configurations(),
    queryFn: () => claimsService.getConfigurations(),
    ...options,
  });
}
