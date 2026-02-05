import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type BulkCreatePlanBenefitsResponse = Awaited<
  ReturnType<typeof productService.bulkCreatePlanBenefits>
>;
type BulkCreatePlanBenefitsPayload = Parameters<
  typeof productService.bulkCreatePlanBenefits
>[1];
type BulkCreatePlanBenefitsVariables = {
  planId: string;
  payload: BulkCreatePlanBenefitsPayload;
};

export function useBulkCreatePlanBenefits(
  options?: UseMutationOptions<
    BulkCreatePlanBenefitsResponse,
    Error,
    BulkCreatePlanBenefitsVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, payload }) =>
      productService.bulkCreatePlanBenefits(planId, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.plans() });
      if (variables?.planId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.planBenefits(variables.planId),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


