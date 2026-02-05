import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type SubmitClaimResponse = Awaited<ReturnType<typeof claimsService.submitClaim>>;
type SubmitClaimVariables = Parameters<typeof claimsService.submitClaim>[0];

export function useSubmitClaim(
  options?: UseMutationOptions<SubmitClaimResponse, Error, SubmitClaimVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimsService.submitClaim,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() });
      if (variables) {
        queryClient.invalidateQueries({ queryKey: claimKeys.detail(variables) });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


