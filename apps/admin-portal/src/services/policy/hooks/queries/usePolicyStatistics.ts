import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type PolicyStatisticsResponse = Awaited<
  ReturnType<typeof policyService.getPolicyStatistics>
>;
type PolicyStatisticsParams = Parameters<
  typeof policyService.getPolicyStatistics
>[0];

export function usePolicyStatistics(
  params?: PolicyStatisticsParams,
  options?: Omit<
    UseQueryOptions<PolicyStatisticsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: policyKeys.policyStatistics(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => policyService.getPolicyStatistics(params),
    ...options,
  });
}
