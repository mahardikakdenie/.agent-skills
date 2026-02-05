import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type PolicyDetailResponse = Awaited<
  ReturnType<typeof policyService.getPolicyById>
>;

export function usePolicyDetail(
  id: string,
  options?: Omit<UseQueryOptions<PolicyDetailResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: policyKeys.policyDetail(id),
    queryFn: () => policyService.getPolicyById(id),
    ...options,
  });
}
