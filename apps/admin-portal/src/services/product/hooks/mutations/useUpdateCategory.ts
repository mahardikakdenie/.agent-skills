import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type UpdateCategoryResponse = Awaited<
  ReturnType<typeof productService.updateCategory>
>;
type UpdateCategoryPayload = Parameters<typeof productService.updateCategory>[1];
type UpdateCategoryVariables = { id: string; payload: UpdateCategoryPayload };

export function useUpdateCategory(
  options?: UseMutationOptions<UpdateCategoryResponse, Error, UpdateCategoryVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => productService.updateCategory(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.categories() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: productKeys.categoryDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


