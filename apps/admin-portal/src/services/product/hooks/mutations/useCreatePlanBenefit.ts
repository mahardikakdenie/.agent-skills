import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CreatePlanBenefitResponse = Awaited<
  ReturnType<typeof productService.createPlanBenefit>
>;
type CreatePlanBenefitPayload = Parameters<
  typeof productService.createPlanBenefit
>[0];

export function useCreatePlanBenefit(
  options?: UseMutationOptions<
    CreatePlanBenefitResponse,
    Error,
    CreatePlanBenefitPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createPlanBenefit,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.plans() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


