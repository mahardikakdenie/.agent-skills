import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type ImportTransactionsResponse = Awaited<
  ReturnType<typeof financeService.importTransactions>
>;
type ImportTransactionsPayload = Parameters<
  typeof financeService.importTransactions
>[0];

export function useImportTransactions(
  options?: UseMutationOptions<
    ImportTransactionsResponse,
    Error,
    ImportTransactionsPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeService.importTransactions,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.billings() });
      queryClient.invalidateQueries({ queryKey: financeKeys.billingNotMatch() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


