import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { channelService } from "../../api/channel.service";
import { channelKeys } from "../../query-keys";

type ChannelsV1Response = Awaited<ReturnType<typeof channelService.getChannelsV1>>;
type ChannelsV1Params = Parameters<typeof channelService.getChannelsV1>[0];

export function useChannelsV1(
  params?: ChannelsV1Params,
  options?: Omit<
    UseQueryOptions<ChannelsV1Response, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: channelKeys.channelListV1(params as Record<string, unknown> | undefined),
    queryFn: () => channelService.getChannelsV1(params),
    ...options,
  });
}
