import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type UploadInsuredPartiesResponse = Awaited<
  ReturnType<typeof policyService.uploadInsuredPartiesFirstTime>
>;
type UploadInsuredPartiesPayload = Parameters<
  typeof policyService.uploadInsuredPartiesFirstTime
>[0];

export function useUploadInsuredPartiesFirstTime(
  options?: UseMutationOptions<
    UploadInsuredPartiesResponse,
    Error,
    UploadInsuredPartiesPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: policyService.uploadInsuredPartiesFirstTime,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.insuredParties() });
      queryClient.invalidateQueries({
        queryKey: policyKeys.insuredPartyStatistics(),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


