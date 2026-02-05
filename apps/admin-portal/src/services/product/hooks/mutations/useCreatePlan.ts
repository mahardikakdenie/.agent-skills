import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CreatePlanResponse = Awaited<ReturnType<typeof productService.createPlan>>;
type CreatePlanPayload = Parameters<typeof productService.createPlan>[0];

export function useCreatePlan(
  options?: UseMutationOptions<CreatePlanResponse, Error, CreatePlanPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createPlan,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.plans() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


