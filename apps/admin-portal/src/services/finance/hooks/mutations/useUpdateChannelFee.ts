import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type UpdateChannelFeeResponse = Awaited<
  ReturnType<typeof financeService.updateChannelFee>
>;
type UpdateChannelFeePayload = Parameters<typeof financeService.updateChannelFee>[1];
type UpdateChannelFeeVariables = { channelId: string; payload: UpdateChannelFeePayload };

export function useUpdateChannelFee(
  options?: UseMutationOptions<
    UpdateChannelFeeResponse,
    Error,
    UpdateChannelFeeVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, payload }) =>
      financeService.updateChannelFee(channelId, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.channelFees() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


