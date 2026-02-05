import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type CampaignReportResponse = Awaited<
  ReturnType<typeof promotionService.getCampaignReport>
>;
type CampaignReportParams = Parameters<typeof promotionService.getCampaignReport>[0];

export function useCampaignReport(
  params?: CampaignReportParams,
  options?: Omit<
    UseQueryOptions<CampaignReportResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: promotionKeys.campaignReport(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => promotionService.getCampaignReport(params),
    ...options,
  });
}
