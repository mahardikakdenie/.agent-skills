import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ClaimChannelFormsResponse = Awaited<
  ReturnType<typeof claimsService.getClaimChannelForms>
>;

export function useClaimChannelForms(
  id: string,
  options?: Omit<
    UseQueryOptions<ClaimChannelFormsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: claimKeys.channelForms(id),
    queryFn: () => claimsService.getClaimChannelForms(id),
    ...options,
  });
}
