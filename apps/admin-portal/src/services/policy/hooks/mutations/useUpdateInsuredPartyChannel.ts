import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type UpdateInsuredPartyChannelResponse = Awaited<
  ReturnType<typeof policyService.updateInsuredPartyChannel>
>;
type UpdateInsuredPartyChannelPayload = Parameters<
  typeof policyService.updateInsuredPartyChannel
>[1];
type UpdateInsuredPartyChannelVariables = {
  channelId: string;
  payload: UpdateInsuredPartyChannelPayload;
};

export function useUpdateInsuredPartyChannel(
  options?: UseMutationOptions<
    UpdateInsuredPartyChannelResponse,
    Error,
    UpdateInsuredPartyChannelVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, payload }) =>
      policyService.updateInsuredPartyChannel(channelId, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.insuredParties() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


