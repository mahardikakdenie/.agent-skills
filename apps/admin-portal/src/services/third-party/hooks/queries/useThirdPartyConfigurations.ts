import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { thirdPartyService } from "../../api/third-party.service";
import type { ThirdPartyConfigFilters } from "../../api/third-party.types";
import { thirdPartyKeys } from "../../query-keys";

type ThirdPartyConfigurationsResponse = Awaited<
  ReturnType<typeof thirdPartyService.getConfigurations>
>;

export function useThirdPartyConfigurations(
  filters?: ThirdPartyConfigFilters,
  options?: Omit<
    UseQueryOptions<ThirdPartyConfigurationsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: thirdPartyKeys.configurationList(filters),
    queryFn: () => thirdPartyService.getConfigurations(filters),
    ...options,
  });
}
