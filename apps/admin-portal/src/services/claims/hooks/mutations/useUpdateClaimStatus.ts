import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type UpdateClaimStatusResponse = Awaited<
  ReturnType<typeof claimsService.updateClaimStatus>
>;
type UpdateClaimStatusPayload = Parameters<typeof claimsService.updateClaimStatus>[1];
type UpdateClaimStatusVariables = { id: string; payload: UpdateClaimStatusPayload };

export function useUpdateClaimStatus(
  options?: UseMutationOptions<
    UpdateClaimStatusResponse,
    Error,
    UpdateClaimStatusVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => claimsService.updateClaimStatus(id, payload),
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


