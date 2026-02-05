import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type UpdateClaimResponse = Awaited<ReturnType<typeof claimsService.updateClaim>>;
type UpdateClaimPayload = Parameters<typeof claimsService.updateClaim>[1];
type UpdateClaimVariables = { id: string; payload: UpdateClaimPayload };

export function useUpdateClaim(
  options?: UseMutationOptions<UpdateClaimResponse, Error, UpdateClaimVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => claimsService.updateClaim(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: claimKeys.detail(variables.id) });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


