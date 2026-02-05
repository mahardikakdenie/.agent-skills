import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type CreateChannelFeeResponse = Awaited<
  ReturnType<typeof financeService.createChannelFee>
>;
type CreateChannelFeePayload = Parameters<typeof financeService.createChannelFee>[1];
type CreateChannelFeeVariables = { channelId: string; payload: CreateChannelFeePayload };

export function useCreateChannelFee(
  options?: UseMutationOptions<
    CreateChannelFeeResponse,
    Error,
    CreateChannelFeeVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, payload }) =>
      financeService.createChannelFee(channelId, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.channelFees() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


