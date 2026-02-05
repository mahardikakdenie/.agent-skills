import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type UpdatePlanResponse = Awaited<ReturnType<typeof productService.updatePlan>>;
type UpdatePlanPayload = Parameters<typeof productService.updatePlan>[1];
type UpdatePlanVariables = { id: string; payload: UpdatePlanPayload };

export function useUpdatePlan(
  options?: UseMutationOptions<UpdatePlanResponse, Error, UpdatePlanVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => productService.updatePlan(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.plans() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: productKeys.planDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


