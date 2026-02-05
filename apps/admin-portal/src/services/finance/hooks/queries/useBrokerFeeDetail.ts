import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type BrokerFeeDetailResponse = Awaited<
  ReturnType<typeof financeService.getBrokerFeeById>
>;

export function useBrokerFeeDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<BrokerFeeDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: financeKeys.brokerFeeDetail(id),
    queryFn: () => financeService.getBrokerFeeById(id),
    ...options,
  });
}
