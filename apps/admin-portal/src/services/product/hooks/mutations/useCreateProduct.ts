import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CreateProductResponse = Awaited<
  ReturnType<typeof productService.createProduct>
>;
type CreateProductPayload = Parameters<typeof productService.createProduct>[0];

export function useCreateProduct(
  options?: UseMutationOptions<CreateProductResponse, Error, CreateProductPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createProduct,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.products() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


