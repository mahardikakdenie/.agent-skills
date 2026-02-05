import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { transactionService } from "../../api/transaction.service";
import { transactionKeys } from "../../query-keys";

type TransactionStatisticsResponse = Awaited<
  ReturnType<typeof transactionService.getTransactionStatistics>
>;
type TransactionStatisticsParams = Parameters<
  typeof transactionService.getTransactionStatistics
>[0];

export function useTransactionStatistics(
  params?: TransactionStatisticsParams,
  options?: Omit<
    UseQueryOptions<TransactionStatisticsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: transactionKeys.transactionStatistics(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => transactionService.getTransactionStatistics(params),
    ...options,
  });
}
