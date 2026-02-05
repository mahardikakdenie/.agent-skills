import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type UnassignChannelPlansResponse = Awaited<
  ReturnType<typeof productService.unassignChannelPlans>
>;
type UnassignChannelPlansPayload = Parameters<
  typeof productService.unassignChannelPlans
>[0];

export function useUnassignChannelPlans(
  options?: UseMutationOptions<
    UnassignChannelPlansResponse,
    Error,
    UnassignChannelPlansPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.unassignChannelPlans,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.packages() });
      queryClient.invalidateQueries({ queryKey: productKeys.plans() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


