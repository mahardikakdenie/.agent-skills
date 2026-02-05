import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { channelService } from "../../api/channel.service";
import { channelKeys } from "../../query-keys";

type ChannelsResponse = Awaited<ReturnType<typeof channelService.getChannels>>;
type ChannelsParams = Parameters<typeof channelService.getChannels>[0];

export function useChannels(
  params?: ChannelsParams,
  options?: Omit<UseQueryOptions<ChannelsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: channelKeys.channelList(params as Record<string, unknown> | undefined),
    queryFn: () => channelService.getChannels(params),
    ...options,
  });
}
