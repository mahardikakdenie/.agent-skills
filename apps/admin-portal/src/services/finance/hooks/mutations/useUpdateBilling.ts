import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type UpdateBillingResponse = Awaited<
  ReturnType<typeof financeService.updateBilling>
>;
type UpdateBillingPayload = Parameters<typeof financeService.updateBilling>[1];
type UpdateBillingVariables = { id: string; payload: UpdateBillingPayload };

export function useUpdateBilling(
  options?: UseMutationOptions<UpdateBillingResponse, Error, UpdateBillingVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => financeService.updateBilling(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.billings() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: financeKeys.billingDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


