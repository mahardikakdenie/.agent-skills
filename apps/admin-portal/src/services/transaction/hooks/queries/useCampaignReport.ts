import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { transactionService } from "../../api/transaction.service";
import { transactionKeys } from "../../query-keys";

type CampaignReportResponse = Awaited<
  ReturnType<typeof transactionService.getCampaignReport>
>;

export function useCampaignReport(
  id: string,
  options?: Omit<
    UseQueryOptions<CampaignReportResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: transactionKeys.campaignReport(id),
    queryFn: () => transactionService.getCampaignReport(id),
    ...options,
  });
}
