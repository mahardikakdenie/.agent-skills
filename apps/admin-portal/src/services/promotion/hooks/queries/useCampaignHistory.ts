import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type CampaignHistoryResponse = Awaited<
  ReturnType<typeof promotionService.getCampaignHistory>
>;

export function useCampaignHistory(
  id: string,
  options?: Omit<
    UseQueryOptions<CampaignHistoryResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: promotionKeys.campaignHistory(id),
    queryFn: () => promotionService.getCampaignHistory(id),
    ...options,
  });
}
