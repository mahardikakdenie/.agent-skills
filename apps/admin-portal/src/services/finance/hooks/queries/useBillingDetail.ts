import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type BillingDetailResponse = Awaited<
  ReturnType<typeof financeService.getBillingById>
>;
type BillingDetailParams = Parameters<typeof financeService.getBillingById>[1];

export function useBillingDetail(
  id: string,
  params?: BillingDetailParams,
  options?: Omit<
    UseQueryOptions<BillingDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: financeKeys.billingDetail(
      id,
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => financeService.getBillingById(id, params),
    ...options,
  });
}
