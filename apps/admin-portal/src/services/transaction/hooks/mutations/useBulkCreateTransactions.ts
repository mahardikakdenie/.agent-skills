import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { transactionService } from "../../api/transaction.service";
import { transactionKeys } from "../../query-keys";

type BulkCreateTransactionsResponse = Awaited<
  ReturnType<typeof transactionService.bulkCreateTransactions>
>;
type BulkCreateTransactionsPayload = Parameters<
  typeof transactionService.bulkCreateTransactions
>[1];
type BulkCreateTransactionsVariables = {
  id: string;
  payload: BulkCreateTransactionsPayload;
};

export function useBulkCreateTransactions(
  options?: UseMutationOptions<
    BulkCreateTransactionsResponse,
    Error,
    BulkCreateTransactionsVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      transactionService.bulkCreateTransactions(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.transactions() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.transactionDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


