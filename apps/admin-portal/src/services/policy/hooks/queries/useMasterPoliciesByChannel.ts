import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type MasterPoliciesResponse = Awaited<
  ReturnType<typeof policyService.getMasterPoliciesByChannel>
>;

export function useMasterPoliciesByChannel(
  channelId: string,
  options?: Omit<
    UseQueryOptions<MasterPoliciesResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: policyKeys.masterPolicies(channelId),
    queryFn: () => policyService.getMasterPoliciesByChannel(channelId),
    ...options,
  });
}
