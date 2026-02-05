import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type BillingsResponse = Awaited<ReturnType<typeof financeService.getBillings>>;
type BillingsParams = Parameters<typeof financeService.getBillings>[0];

export function useBillings(
  params?: BillingsParams,
  options?: Omit<UseQueryOptions<BillingsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: financeKeys.billingList(params as Record<string, unknown> | undefined),
    queryFn: () => financeService.getBillings(params),
    ...options,
  });
}
