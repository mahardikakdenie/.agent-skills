import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { channelService } from "../../api/channel.service";
import { channelKeys } from "../../query-keys";

type UpdateChannelResponse = Awaited<
  ReturnType<typeof channelService.updateChannel>
>;
type UpdateChannelPayload = Parameters<typeof channelService.updateChannel>[1];
type UpdateChannelVariables = { id: string; payload: UpdateChannelPayload };

export function useUpdateChannel(
  options?: UseMutationOptions<UpdateChannelResponse, Error, UpdateChannelVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => channelService.updateChannel(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.channelsV1() });
      queryClient.invalidateQueries({ queryKey: channelKeys.channels() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: channelKeys.channelDetailV1(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


