import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type CreateBillingResponse = Awaited<
  ReturnType<typeof financeService.createBilling>
>;
type CreateBillingPayload = Parameters<typeof financeService.createBilling>[0];

export function useCreateBilling(
  options?: UseMutationOptions<CreateBillingResponse, Error, CreateBillingPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeService.createBilling,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.billings() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


