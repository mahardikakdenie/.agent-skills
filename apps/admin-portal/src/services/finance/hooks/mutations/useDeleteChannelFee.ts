import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type DeleteChannelFeeResponse = Awaited<
  ReturnType<typeof financeService.deleteChannelFee>
>;
type DeleteChannelFeeVariables = Parameters<typeof financeService.deleteChannelFee>[0];

export function useDeleteChannelFee(
  options?: UseMutationOptions<DeleteChannelFeeResponse, Error, DeleteChannelFeeVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeService.deleteChannelFee,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.channelFees() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: financeKeys.channelFeeDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


