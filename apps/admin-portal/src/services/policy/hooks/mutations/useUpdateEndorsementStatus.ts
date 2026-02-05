import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type UpdateEndorsementStatusResponse = Awaited<
  ReturnType<typeof policyService.updateEndorsementStatus>
>;
type UpdateEndorsementStatusPayload = Parameters<
  typeof policyService.updateEndorsementStatus
>[1];
type UpdateEndorsementStatusVariables = {
  id: string;
  payload: UpdateEndorsementStatusPayload;
};

export function useUpdateEndorsementStatus(
  options?: UseMutationOptions<
    UpdateEndorsementStatusResponse,
    Error,
    UpdateEndorsementStatusVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      policyService.updateEndorsementStatus(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.endorsements() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: policyKeys.endorsementDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


