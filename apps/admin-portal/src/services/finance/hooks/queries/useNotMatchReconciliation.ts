import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type NotMatchReconciliationResponse = Awaited<
  ReturnType<typeof financeService.getNotMatchReconciliation>
>;
type NotMatchReconciliationParams = Parameters<
  typeof financeService.getNotMatchReconciliation
>[0];

export function useNotMatchReconciliation(
  params?: NotMatchReconciliationParams,
  options?: Omit<
    UseQueryOptions<NotMatchReconciliationResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: financeKeys.billingNotMatch(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => financeService.getNotMatchReconciliation(params),
    ...options,
  });
}
