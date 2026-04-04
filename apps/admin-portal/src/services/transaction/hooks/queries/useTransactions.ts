import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { transactionService } from "../../api/transaction.service";
import { transactionKeys } from "../../query-keys";

type TransactionsResponse = Awaited<
  ReturnType<typeof transactionService.getTransactions>
>;
type TransactionsParams = Parameters<typeof transactionService.getTransactions>[0];

export function useTransactions(
  params?: TransactionsParams,
  options?: Omit<
    UseQueryOptions<TransactionsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: transactionKeys.transactionList(
      params as Record<string, unknown> | undefined
    ),
    queryFn: ({ signal }) => transactionService.getTransactions(params, { signal }),
    ...options,
  });
}
