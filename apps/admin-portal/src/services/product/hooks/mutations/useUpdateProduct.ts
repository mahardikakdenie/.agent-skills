import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type UpdateProductResponse = Awaited<
  ReturnType<typeof productService.updateProduct>
>;
type UpdateProductPayload = Parameters<typeof productService.updateProduct>[1];
type UpdateProductVariables = { id: string; payload: UpdateProductPayload };

export function useUpdateProduct(
  options?: UseMutationOptions<UpdateProductResponse, Error, UpdateProductVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => productService.updateProduct(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.products() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: productKeys.productDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


