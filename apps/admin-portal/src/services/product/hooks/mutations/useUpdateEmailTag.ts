import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type UpdateEmailTagResponse = Awaited<
  ReturnType<typeof productService.updateEmailTag>
>;
type UpdateEmailTagPayload = Parameters<typeof productService.updateEmailTag>[1];
type UpdateEmailTagVariables = { id: string; payload: UpdateEmailTagPayload };

export function useUpdateEmailTag(
  options?: UseMutationOptions<UpdateEmailTagResponse, Error, UpdateEmailTagVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => productService.updateEmailTag(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.emailTags() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: productKeys.emailTagDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


