import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type DeleteBrokerFeeResponse = Awaited<
  ReturnType<typeof financeService.deleteBrokerFee>
>;
type DeleteBrokerFeeVariables = Parameters<typeof financeService.deleteBrokerFee>[0];

export function useDeleteBrokerFee(
  options?: UseMutationOptions<DeleteBrokerFeeResponse, Error, DeleteBrokerFeeVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeService.deleteBrokerFee,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.brokerFees() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: financeKeys.brokerFeeDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


