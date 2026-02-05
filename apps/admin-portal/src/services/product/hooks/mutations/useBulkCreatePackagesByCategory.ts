import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type BulkCreatePackagesResponse = Awaited<
  ReturnType<typeof productService.bulkCreatePackagesByCategory>
>;
type BulkCreatePackagesPayload = Parameters<
  typeof productService.bulkCreatePackagesByCategory
>[2];
type BulkCreatePackagesVariables = {
  category: string;
  id: string;
  payload: BulkCreatePackagesPayload;
};

export function useBulkCreatePackagesByCategory(
  options?: UseMutationOptions<
    BulkCreatePackagesResponse,
    Error,
    BulkCreatePackagesVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ category, id, payload }) =>
      productService.bulkCreatePackagesByCategory(category, id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.packages() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


