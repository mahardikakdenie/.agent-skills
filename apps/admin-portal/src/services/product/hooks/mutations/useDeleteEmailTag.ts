import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type DeleteEmailTagResponse = Awaited<
  ReturnType<typeof productService.deleteEmailTag>
>;
type DeleteEmailTagVariables = Parameters<typeof productService.deleteEmailTag>[0];

export function useDeleteEmailTag(
  options?: UseMutationOptions<DeleteEmailTagResponse, Error, DeleteEmailTagVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deleteEmailTag,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.emailTags() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: productKeys.emailTagDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


