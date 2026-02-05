import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type UpdatePackageResponse = Awaited<
  ReturnType<typeof productService.updatePackage>
>;
type UpdatePackagePayload = Parameters<typeof productService.updatePackage>[1];
type UpdatePackageVariables = { id: string; payload: UpdatePackagePayload };

export function useUpdatePackage(
  options?: UseMutationOptions<UpdatePackageResponse, Error, UpdatePackageVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => productService.updatePackage(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.packages() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: productKeys.packageDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


