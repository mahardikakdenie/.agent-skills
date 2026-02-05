import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { transactionService } from "../../api/transaction.service";
import { transactionKeys } from "../../query-keys";

type TransactionDetailResponse = Awaited<
  ReturnType<typeof transactionService.getTransactionById>
>;

export function useTransactionDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<TransactionDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: transactionKeys.transactionDetail(id),
    queryFn: () => transactionService.getTransactionById(id),
    ...options,
  });
}
