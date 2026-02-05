import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CreateEmailTagResponse = Awaited<
  ReturnType<typeof productService.createEmailTag>
>;
type CreateEmailTagPayload = Parameters<typeof productService.createEmailTag>[0];

export function useCreateEmailTag(
  options?: UseMutationOptions<CreateEmailTagResponse, Error, CreateEmailTagPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createEmailTag,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.emailTags() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


