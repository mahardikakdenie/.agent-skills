import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { communicationApiService } from "../../api/communication.service";
import type { ChannelProviderFilters } from "../../api/communication.types";
import { communicationKeys } from "../../query-keys";

type AvailableProvidersResponse = Awaited<
  ReturnType<typeof communicationApiService.getAvailableProviders>
>;

export function useAvailableProviders(
  filters?: ChannelProviderFilters,
  options?: Omit<
    UseQueryOptions<AvailableProvidersResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: communicationKeys.availableProviders(filters),
    queryFn: () => communicationApiService.getAvailableProviders(filters),
    enabled: Boolean(filters?.type),
    ...options,
  });
}
