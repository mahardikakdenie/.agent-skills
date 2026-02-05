import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CreateCategoryResponse = Awaited<
  ReturnType<typeof productService.createCategory>
>;
type CreateCategoryPayload = Parameters<typeof productService.createCategory>[0];

export function useCreateCategory(
  options?: UseMutationOptions<CreateCategoryResponse, Error, CreateCategoryPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createCategory,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.categories() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


