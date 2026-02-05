import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { transactionService } from "../../api/transaction.service";
import { transactionKeys } from "../../query-keys";

type UpdateTransactionPaymentResponse = Awaited<
  ReturnType<typeof transactionService.updateTransactionPayment>
>;
type UpdateTransactionPaymentPayload = Parameters<
  typeof transactionService.updateTransactionPayment
>[1];
type UpdateTransactionPaymentVariables = {
  id: string;
  payload: UpdateTransactionPaymentPayload;
};

export function useUpdateTransactionPayment(
  options?: UseMutationOptions<
    UpdateTransactionPaymentResponse,
    Error,
    UpdateTransactionPaymentVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      transactionService.updateTransactionPayment(id, payload),
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


