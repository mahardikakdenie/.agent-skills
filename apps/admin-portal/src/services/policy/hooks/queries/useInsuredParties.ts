import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type InsuredPartiesResponse = Awaited<
  ReturnType<typeof policyService.getInsuredParties>
>;
type InsuredPartiesParams = Parameters<typeof policyService.getInsuredParties>[0];

export function useInsuredParties(
  params?: InsuredPartiesParams,
  options?: Omit<
    UseQueryOptions<InsuredPartiesResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: policyKeys.insuredPartyList(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => policyService.getInsuredParties(params),
    ...options,
  });
}
