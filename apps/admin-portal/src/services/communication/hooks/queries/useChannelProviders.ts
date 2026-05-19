import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { communicationApiService } from "../../api/communication.service";
import type { ChannelProviderFilters } from "../../api/communication.types";
import { communicationKeys } from "../../query-keys";

type ChannelProvidersResponse = Awaited<
  ReturnType<typeof communicationApiService.getChannelProviders>
>;

export function useChannelProvidersQuery(
  filters?: ChannelProviderFilters,
  options?: Omit<
    UseQueryOptions<ChannelProvidersResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: communicationKeys.channelProviderList(filters),
    queryFn: () => communicationApiService.getChannelProviders(filters),
    ...options,
  });
}
