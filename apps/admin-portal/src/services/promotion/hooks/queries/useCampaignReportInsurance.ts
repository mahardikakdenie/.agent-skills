import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type CampaignReportInsuranceResponse = Awaited<
  ReturnType<typeof promotionService.getCampaignReportInsurance>
>;
type CampaignReportInsuranceParams = Parameters<
  typeof promotionService.getCampaignReportInsurance
>[0];

export function useCampaignReportInsurance(
  params?: CampaignReportInsuranceParams,
  options?: Omit<
    UseQueryOptions<CampaignReportInsuranceResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: promotionKeys.campaignReportInsurance(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => promotionService.getCampaignReportInsurance(params),
    ...options,
  });
}
