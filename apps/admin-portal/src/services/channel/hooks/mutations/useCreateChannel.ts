import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { channelService } from "../../api/channel.service";
import { channelKeys } from "../../query-keys";

type CreateChannelResponse = Awaited<
  ReturnType<typeof channelService.createChannel>
>;
type CreateChannelPayload = Parameters<typeof channelService.createChannel>[0];

export function useCreateChannel(
  options?: UseMutationOptions<CreateChannelResponse, Error, CreateChannelPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: channelService.createChannel,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.channelsV1() });
      queryClient.invalidateQueries({ queryKey: channelKeys.channels() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


