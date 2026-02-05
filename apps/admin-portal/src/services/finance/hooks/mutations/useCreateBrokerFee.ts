import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type CreateBrokerFeeResponse = Awaited<
  ReturnType<typeof financeService.createBrokerFee>
>;
type CreateBrokerFeePayload = Parameters<typeof financeService.createBrokerFee>[0];

export function useCreateBrokerFee(
  options?: UseMutationOptions<CreateBrokerFeeResponse, Error, CreateBrokerFeePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeService.createBrokerFee,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.brokerFees() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


