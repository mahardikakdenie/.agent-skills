import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ClaimCategoryFormsResponse = Awaited<
  ReturnType<typeof claimsService.getClaimCategoryForms>
>;
type ClaimCategoryFormsParams = Parameters<
  typeof claimsService.getClaimCategoryForms
>[1];

export function useClaimCategoryForms(
  id: string,
  params?: ClaimCategoryFormsParams,
  options?: Omit<
    UseQueryOptions<ClaimCategoryFormsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: claimKeys.categoryForms(
      id,
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => claimsService.getClaimCategoryForms(id, params),
    ...options,
  });
}
