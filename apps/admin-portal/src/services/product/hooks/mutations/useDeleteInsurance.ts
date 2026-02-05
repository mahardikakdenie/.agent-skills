import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type DeleteInsuranceResponse = Awaited<
  ReturnType<typeof productService.deleteInsurance>
>;
type DeleteInsuranceVariables = Parameters<typeof productService.deleteInsurance>[0];

export function useDeleteInsurance(
  options?: UseMutationOptions<DeleteInsuranceResponse, Error, DeleteInsuranceVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deleteInsurance,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.insurances() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: productKeys.insuranceDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


