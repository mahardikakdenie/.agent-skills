import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type BrokerFeesFilterResponse = Awaited<
  ReturnType<typeof financeService.getBrokerFeesFilter>
>;
type BrokerFeesFilterParams = Parameters<
  typeof financeService.getBrokerFeesFilter
>[0];

export function useBrokerFeesFilter(
  params?: BrokerFeesFilterParams,
  options?: Omit<
    UseQueryOptions<BrokerFeesFilterResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: financeKeys.brokerFeesFilter(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => financeService.getBrokerFeesFilter(params),
    ...options,
  });
}
