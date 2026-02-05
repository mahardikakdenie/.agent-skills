import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { transactionService } from "../../api/transaction.service";
import { transactionKeys } from "../../query-keys";

type CreateTransactionsConventionalResponse = Awaited<
  ReturnType<typeof transactionService.createTransactionsConventional>
>;
type CreateTransactionsConventionalPayload = Parameters<
  typeof transactionService.createTransactionsConventional
>[0];

export function useCreateTransactionsConventional(
  options?: UseMutationOptions<
    CreateTransactionsConventionalResponse,
    Error,
    CreateTransactionsConventionalPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.createTransactionsConventional,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.transactions() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


