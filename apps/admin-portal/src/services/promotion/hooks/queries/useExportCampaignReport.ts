import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type ExportCampaignReportResponse = Awaited<
  ReturnType<typeof promotionService.exportCampaignReport>
>;
type ExportCampaignReportParams = Parameters<
  typeof promotionService.exportCampaignReport
>[0];

export function useExportCampaignReport(
  params?: ExportCampaignReportParams,
  options?: Omit<
    UseQueryOptions<ExportCampaignReportResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: promotionKeys.campaignReportExport(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => promotionService.exportCampaignReport(params),
    ...options,
  });
}
