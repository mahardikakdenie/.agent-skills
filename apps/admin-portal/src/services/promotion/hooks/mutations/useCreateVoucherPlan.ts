import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type CreateVoucherPlanResponse = Awaited<
  ReturnType<typeof promotionService.createVoucherPlan>
>;
type CreateVoucherPlanPayload = Parameters<typeof promotionService.createVoucherPlan>[0];

export function useCreateVoucherPlan(
  options?: UseMutationOptions<
    CreateVoucherPlanResponse,
    Error,
    CreateVoucherPlanPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: promotionService.createVoucherPlan,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.all });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


