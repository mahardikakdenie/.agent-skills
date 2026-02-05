import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type CampaignsResponse = Awaited<
  ReturnType<typeof promotionService.getCampaigns>
>;
type CampaignsParams = Parameters<typeof promotionService.getCampaigns>[0];

export function useCampaigns(
  params?: CampaignsParams,
  options?: Omit<UseQueryOptions<CampaignsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: promotionKeys.campaignList(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => promotionService.getCampaigns(params),
    ...options,
  });
}
