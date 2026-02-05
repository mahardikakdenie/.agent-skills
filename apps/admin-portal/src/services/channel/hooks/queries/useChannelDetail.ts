import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { channelService } from "../../api/channel.service";
import { channelKeys } from "../../query-keys";

type ChannelDetailResponse = Awaited<
  ReturnType<typeof channelService.getChannelById>
>;

export function useChannelDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<ChannelDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: channelKeys.channelDetail(id),
    queryFn: () => channelService.getChannelById(id),
    ...options,
  });
}
