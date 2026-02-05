import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type ExportCampaignReportInsuranceResponse = Awaited<
  ReturnType<typeof promotionService.exportCampaignReportInsurance>
>;
type ExportCampaignReportInsuranceParams = Parameters<
  typeof promotionService.exportCampaignReportInsurance
>[0];

export function useExportCampaignReportInsurance(
  params?: ExportCampaignReportInsuranceParams,
  options?: Omit<
    UseQueryOptions<ExportCampaignReportInsuranceResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: promotionKeys.campaignReportExportInsurance(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => promotionService.exportCampaignReportInsurance(params),
    ...options,
  });
}
