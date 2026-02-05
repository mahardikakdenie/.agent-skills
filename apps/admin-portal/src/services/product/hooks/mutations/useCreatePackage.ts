import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CreatePackageResponse = Awaited<
  ReturnType<typeof productService.createPackage>
>;
type CreatePackagePayload = Parameters<typeof productService.createPackage>[0];

export function useCreatePackage(
  options?: UseMutationOptions<CreatePackageResponse, Error, CreatePackagePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createPackage,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.packages() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


