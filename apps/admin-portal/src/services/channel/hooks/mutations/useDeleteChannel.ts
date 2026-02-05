import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { channelService } from "../../api/channel.service";
import { channelKeys } from "../../query-keys";

type DeleteChannelResponse = Awaited<
  ReturnType<typeof channelService.deleteChannel>
>;
type DeleteChannelVariables = Parameters<typeof channelService.deleteChannel>[0];

export function useDeleteChannel(
  options?: UseMutationOptions<DeleteChannelResponse, Error, DeleteChannelVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: channelService.deleteChannel,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.channelsV1() });
      queryClient.invalidateQueries({ queryKey: channelKeys.channels() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: channelKeys.channelDetailV1(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


