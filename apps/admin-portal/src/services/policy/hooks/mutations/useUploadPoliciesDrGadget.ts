import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type UploadPoliciesResponse = Awaited<
  ReturnType<typeof policyService.uploadPoliciesDrGadget>
>;
type UploadPoliciesPayload = Parameters<
  typeof policyService.uploadPoliciesDrGadget
>[0];

export function useUploadPoliciesDrGadget(
  options?: UseMutationOptions<
    UploadPoliciesResponse,
    Error,
    UploadPoliciesPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: policyService.uploadPoliciesDrGadget,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.policies() });
      queryClient.invalidateQueries({ queryKey: policyKeys.policyStatistics() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


