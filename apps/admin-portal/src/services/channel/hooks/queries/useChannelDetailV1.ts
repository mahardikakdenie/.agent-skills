import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { channelService } from "../../api/channel.service";
import { channelKeys } from "../../query-keys";

type ChannelDetailV1Response = Awaited<
  ReturnType<typeof channelService.getChannelByIdV1>
>;

export function useChannelDetailV1(
  id: string,
  options?: Omit<
    UseQueryOptions<ChannelDetailV1Response, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: channelKeys.channelDetailV1(id),
    queryFn: () => channelService.getChannelByIdV1(id),
    ...options,
  });
}
