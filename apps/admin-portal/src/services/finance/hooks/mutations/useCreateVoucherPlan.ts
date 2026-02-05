import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type CreateVoucherPlanResponse = Awaited<
  ReturnType<typeof financeService.createVoucherPlan>
>;
type CreateVoucherPlanPayload = Parameters<typeof financeService.createVoucherPlan>[0];

export function useCreateVoucherPlan(
  options?: UseMutationOptions<
    CreateVoucherPlanResponse,
    Error,
    CreateVoucherPlanPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeService.createVoucherPlan,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.all });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


