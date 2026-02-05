import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { transactionService } from "../../api/transaction.service";
import { transactionKeys } from "../../query-keys";

type UpdateTransactionStatusResponse = Awaited<
  ReturnType<typeof transactionService.updateTransactionStatus>
>;
type UpdateTransactionStatusPayload = Parameters<
  typeof transactionService.updateTransactionStatus
>[1];
type UpdateTransactionStatusVariables = {
  id: string;
  payload: UpdateTransactionStatusPayload;
};

export function useUpdateTransactionStatus(
  options?: UseMutationOptions<
    UpdateTransactionStatusResponse,
    Error,
    UpdateTransactionStatusVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      transactionService.updateTransactionStatus(id, payload),
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


