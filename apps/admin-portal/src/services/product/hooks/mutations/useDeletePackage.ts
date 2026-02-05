import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type DeletePackageResponse = Awaited<
  ReturnType<typeof productService.deletePackage>
>;
type DeletePackageVariables = Parameters<typeof productService.deletePackage>[0];

export function useDeletePackage(
  options?: UseMutationOptions<DeletePackageResponse, Error, DeletePackageVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deletePackage,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.packages() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: productKeys.packageDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


