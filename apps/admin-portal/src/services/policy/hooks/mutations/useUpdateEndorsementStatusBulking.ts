import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type UpdateEndorsementStatusBulkingResponse = Awaited<
  ReturnType<typeof policyService.updateEndorsementStatusBulking>
>;
type UpdateEndorsementStatusBulkingPayload = Parameters<
  typeof policyService.updateEndorsementStatusBulking
>[1];
type UpdateEndorsementStatusBulkingVariables = {
  id: string;
  payload: UpdateEndorsementStatusBulkingPayload;
};

export function useUpdateEndorsementStatusBulking(
  options?: UseMutationOptions<
    UpdateEndorsementStatusBulkingResponse,
    Error,
    UpdateEndorsementStatusBulkingVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      policyService.updateEndorsementStatusBulking(id, payload),
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


