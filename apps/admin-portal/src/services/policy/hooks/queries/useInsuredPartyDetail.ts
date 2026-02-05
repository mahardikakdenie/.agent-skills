import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type InsuredPartyDetailResponse = Awaited<
  ReturnType<typeof policyService.getInsuredPartyById>
>;

export function useInsuredPartyDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<InsuredPartyDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: policyKeys.insuredPartyDetail(id),
    queryFn: () => policyService.getInsuredPartyById(id),
    ...options,
  });
}
