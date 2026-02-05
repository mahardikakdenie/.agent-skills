import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type UploadInsuredPartiesNoTxResponse = Awaited<
  ReturnType<typeof policyService.uploadInsuredPartiesFirstTimeWithoutTransaction>
>;
type UploadInsuredPartiesNoTxPayload = Parameters<
  typeof policyService.uploadInsuredPartiesFirstTimeWithoutTransaction
>[0];

export function useUploadInsuredPartiesFirstTimeWithoutTransaction(
  options?: UseMutationOptions<
    UploadInsuredPartiesNoTxResponse,
    Error,
    UploadInsuredPartiesNoTxPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: policyService.uploadInsuredPartiesFirstTimeWithoutTransaction,
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


