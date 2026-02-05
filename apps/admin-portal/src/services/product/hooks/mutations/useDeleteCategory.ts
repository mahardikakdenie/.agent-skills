import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type DeleteCategoryResponse = Awaited<
  ReturnType<typeof productService.deleteCategory>
>;
type DeleteCategoryVariables = Parameters<typeof productService.deleteCategory>[0];

export function useDeleteCategory(
  options?: UseMutationOptions<DeleteCategoryResponse, Error, DeleteCategoryVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deleteCategory,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.categories() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: productKeys.categoryDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


