import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type PoliciesResponse = Awaited<ReturnType<typeof policyService.getPolicies>>;
type PoliciesParams = Parameters<typeof policyService.getPolicies>[0];

export function usePolicies(
  params?: PoliciesParams,
  options?: Omit<UseQueryOptions<PoliciesResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: policyKeys.policyList(params as Record<string, unknown> | undefined),
    queryFn: () => policyService.getPolicies(params),
    ...options,
  });
}
