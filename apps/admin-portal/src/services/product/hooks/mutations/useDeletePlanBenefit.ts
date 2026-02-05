import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type DeletePlanBenefitResponse = Awaited<
  ReturnType<typeof productService.deletePlanBenefit>
>;
type DeletePlanBenefitVariables = Parameters<
  typeof productService.deletePlanBenefit
>[0];

export function useDeletePlanBenefit(
  options?: UseMutationOptions<
    DeletePlanBenefitResponse,
    Error,
    DeletePlanBenefitVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deletePlanBenefit,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.plans() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


