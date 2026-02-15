import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { channelService } from "../../api/channel.service";
import { channelKeys } from "../../query-keys";

type ChannelConfigurationsResponse = Awaited<
  ReturnType<typeof channelService.getChannelConfigurations>
>;
type ChannelConfigurationsParams = Parameters<
  typeof channelService.getChannelConfigurations
>[0];

export function useChannelConfigurations(
  params?: ChannelConfigurationsParams,
  options?: Omit<
    UseQueryOptions<ChannelConfigurationsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: channelKeys.channelConfigurations(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => channelService.getChannelConfigurations(params),
    ...options,
  });
}

