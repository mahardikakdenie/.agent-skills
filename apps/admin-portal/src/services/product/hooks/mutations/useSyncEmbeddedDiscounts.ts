import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type SyncEmbeddedDiscountsResponse = Awaited<
  ReturnType<typeof productService.syncEmbeddedDiscounts>
>;

export function useSyncEmbeddedDiscounts(
  options?: UseMutationOptions<SyncEmbeddedDiscountsResponse, Error, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => productService.syncEmbeddedDiscounts(),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.plans() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


