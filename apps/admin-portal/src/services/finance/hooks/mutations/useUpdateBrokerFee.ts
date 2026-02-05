import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type UpdateBrokerFeeResponse = Awaited<
  ReturnType<typeof financeService.updateBrokerFee>
>;
type UpdateBrokerFeePayload = Parameters<typeof financeService.updateBrokerFee>[1];
type UpdateBrokerFeeVariables = { id: string; payload: UpdateBrokerFeePayload };

export function useUpdateBrokerFee(
  options?: UseMutationOptions<UpdateBrokerFeeResponse, Error, UpdateBrokerFeeVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => financeService.updateBrokerFee(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.brokerFees() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: financeKeys.brokerFeeDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


