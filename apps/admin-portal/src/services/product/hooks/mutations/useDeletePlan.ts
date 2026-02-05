import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type DeletePlanResponse = Awaited<ReturnType<typeof productService.deletePlan>>;
type DeletePlanVariables = Parameters<typeof productService.deletePlan>[0];

export function useDeletePlan(
  options?: UseMutationOptions<DeletePlanResponse, Error, DeletePlanVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deletePlan,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.plans() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: productKeys.planDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


