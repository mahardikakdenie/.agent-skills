import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { thirdPartyService } from "../../api/third-party.service";
import type { ChannelMappingFilters } from "../../api/third-party.types";
import { thirdPartyKeys } from "../../query-keys";

type ChannelMappingsResponse = Awaited<
  ReturnType<typeof thirdPartyService.getChannelMappings>
>;

export function useChannelMappings(
  filters?: ChannelMappingFilters,
  options?: Omit<
    UseQueryOptions<ChannelMappingsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: thirdPartyKeys.channelMappingList(filters),
    queryFn: () => thirdPartyService.getChannelMappings(filters),
    ...options,
  });
}
