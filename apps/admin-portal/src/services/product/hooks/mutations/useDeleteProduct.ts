import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type DeleteProductResponse = Awaited<
  ReturnType<typeof productService.deleteProduct>
>;
type DeleteProductVariables = Parameters<typeof productService.deleteProduct>[0];

export function useDeleteProduct(
  options?: UseMutationOptions<DeleteProductResponse, Error, DeleteProductVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deleteProduct,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.products() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: productKeys.productDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


