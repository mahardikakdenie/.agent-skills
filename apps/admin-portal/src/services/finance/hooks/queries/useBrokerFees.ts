import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type BrokerFeesResponse = Awaited<
  ReturnType<typeof financeService.getBrokerFees>
>;
type BrokerFeesParams = Parameters<typeof financeService.getBrokerFees>[0];

export function useBrokerFees(
  params?: BrokerFeesParams,
  options?: Omit<
    UseQueryOptions<BrokerFeesResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: financeKeys.brokerFeeList(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => financeService.getBrokerFees(params),
    ...options,
  });
}
