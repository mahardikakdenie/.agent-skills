import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { channelService } from "../../api/channel.service";
import { channelKeys } from "../../query-keys";

type ChannelsParams = Parameters<typeof channelService.getChannels>[0];
type AllChannelsResponse = Awaited<ReturnType<typeof channelService.getChannels>>;

export function useAllChannels(
  params?: ChannelsParams,
  options?: Omit<
    UseQueryOptions<AllChannelsResponse[], Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: channelKeys.channelAll(params as Record<string, unknown> | undefined),
    queryFn: async () => {
      const allChannels: AllChannelsResponse[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const response: any = await channelService.getChannels({
          ...(params || {}),
          page: currentPage,
          limit: 100,
        });

        if (response?.data) {
          allChannels.push(...response.data);
          hasMore = currentPage < (response?.pageTotal || 1);
          currentPage += 1;
        } else {
          hasMore = false;
        }
      }

      return allChannels;
    },
    ...options,
  });
}

