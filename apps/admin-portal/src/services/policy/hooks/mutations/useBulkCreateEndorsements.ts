import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type BulkCreateEndorsementsResponse = Awaited<
  ReturnType<typeof policyService.bulkCreateEndorsements>
>;
type BulkCreateEndorsementsPayload = Parameters<
  typeof policyService.bulkCreateEndorsements
>[0];

export function useBulkCreateEndorsements(
  options?: UseMutationOptions<
    BulkCreateEndorsementsResponse,
    Error,
    BulkCreateEndorsementsPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: policyService.bulkCreateEndorsements,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.endorsements() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


