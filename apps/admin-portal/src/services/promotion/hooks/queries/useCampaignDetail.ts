import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type CampaignDetailResponse = Awaited<
  ReturnType<typeof promotionService.getCampaignById>
>;

export function useCampaignDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<CampaignDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: promotionKeys.campaignDetail(id),
    queryFn: () => promotionService.getCampaignById(id),
    ...options,
  });
}
