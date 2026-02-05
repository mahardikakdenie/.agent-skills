import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type CampaignSearchResponse = Awaited<
  ReturnType<typeof promotionService.searchCampaigns>
>;
type CampaignSearchParams = Parameters<typeof promotionService.searchCampaigns>[0];

export function useCampaignSearch(
  params?: CampaignSearchParams,
  options?: Omit<
    UseQueryOptions<CampaignSearchResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: promotionKeys.campaignSearch(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => promotionService.searchCampaigns(params),
    ...options,
  });
}
