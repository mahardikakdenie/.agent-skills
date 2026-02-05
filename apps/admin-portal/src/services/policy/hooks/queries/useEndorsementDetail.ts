import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type EndorsementDetailResponse = Awaited<
  ReturnType<typeof policyService.getEndorsementById>
>;

export function useEndorsementDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<EndorsementDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: policyKeys.endorsementDetail(id),
    queryFn: () => policyService.getEndorsementById(id),
    ...options,
  });
}
