import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { transactionService } from "../../api/transaction.service";
import { transactionKeys } from "../../query-keys";

type CustomerCampaignsResponse = Awaited<
  ReturnType<typeof transactionService.getCustomerCampaigns>
>;
type CustomerCampaignsParams = Parameters<
  typeof transactionService.getCustomerCampaigns
>[0];

export function useCustomerCampaigns(
  params?: CustomerCampaignsParams,
  options?: Omit<
    UseQueryOptions<CustomerCampaignsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: transactionKeys.customerCampaigns(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => transactionService.getCustomerCampaigns(params),
    ...options,
  });
}
