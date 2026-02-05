import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type InsuredPartyStatisticsResponse = Awaited<
  ReturnType<typeof policyService.getInsuredPartyStatistics>
>;
type InsuredPartyStatisticsParams = Parameters<
  typeof policyService.getInsuredPartyStatistics
>[0];

export function useInsuredPartyStatistics(
  params?: InsuredPartyStatisticsParams,
  options?: Omit<
    UseQueryOptions<InsuredPartyStatisticsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: policyKeys.insuredPartyStatistics(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => policyService.getInsuredPartyStatistics(params),
    ...options,
  });
}
