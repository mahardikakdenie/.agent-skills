import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type ConfirmBillingReconciliationResponse = Awaited<
  ReturnType<typeof financeService.confirmBillingReconciliation>
>;
type ConfirmBillingReconciliationVariables = Parameters<
  typeof financeService.confirmBillingReconciliation
>[0];

export function useConfirmBillingReconciliation(
  options?: UseMutationOptions<
    ConfirmBillingReconciliationResponse,
    Error,
    ConfirmBillingReconciliationVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeService.confirmBillingReconciliation,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.billings() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: financeKeys.billingDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


