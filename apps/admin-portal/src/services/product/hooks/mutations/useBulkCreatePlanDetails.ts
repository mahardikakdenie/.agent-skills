import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type BulkCreatePlanDetailsResponse = Awaited<
  ReturnType<typeof productService.bulkCreatePlanDetails>
>;
type BulkCreatePlanDetailsPayload = Parameters<
  typeof productService.bulkCreatePlanDetails
>[2];
type BulkCreatePlanDetailsVariables = {
  planId: string;
  type: string;
  payload: BulkCreatePlanDetailsPayload;
};

export function useBulkCreatePlanDetails(
  options?: UseMutationOptions<
    BulkCreatePlanDetailsResponse,
    Error,
    BulkCreatePlanDetailsVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, type, payload }) =>
      productService.bulkCreatePlanDetails(planId, type, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.plans() });
      if (variables?.planId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.planDetails(variables.planId, variables.type),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


