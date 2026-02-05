import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type RenewPolicyResponse = Awaited<ReturnType<typeof policyService.renewPolicy>>;
type RenewPolicyVariables = Parameters<typeof policyService.renewPolicy>[0];

export function useRenewPolicy(
  options?: UseMutationOptions<RenewPolicyResponse, Error, RenewPolicyVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: policyService.renewPolicy,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.policies() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: policyKeys.policyDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


