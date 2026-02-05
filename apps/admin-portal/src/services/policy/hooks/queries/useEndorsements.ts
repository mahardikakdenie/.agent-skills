import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type EndorsementsResponse = Awaited<
  ReturnType<typeof policyService.getEndorsements>
>;
type EndorsementsParams = Parameters<typeof policyService.getEndorsements>[0];

export function useEndorsements(
  params?: EndorsementsParams,
  options?: Omit<
    UseQueryOptions<EndorsementsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: policyKeys.endorsementList(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => policyService.getEndorsements(params),
    ...options,
  });
}
