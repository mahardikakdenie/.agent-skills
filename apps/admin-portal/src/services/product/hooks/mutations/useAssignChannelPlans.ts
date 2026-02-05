import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type AssignChannelPlansResponse = Awaited<
  ReturnType<typeof productService.assignChannelPlans>
>;
type AssignChannelPlansPayload = Parameters<
  typeof productService.assignChannelPlans
>[0];

export function useAssignChannelPlans(
  options?: UseMutationOptions<
    AssignChannelPlansResponse,
    Error,
    AssignChannelPlansPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.assignChannelPlans,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.packages() });
      queryClient.invalidateQueries({ queryKey: productKeys.plans() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


