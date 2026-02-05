import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type UpdateInsuranceResponse = Awaited<
  ReturnType<typeof productService.updateInsurance>
>;
type UpdateInsurancePayload = Parameters<typeof productService.updateInsurance>[1];
type UpdateInsuranceVariables = { id: string; payload: UpdateInsurancePayload };

export function useUpdateInsurance(
  options?: UseMutationOptions<UpdateInsuranceResponse, Error, UpdateInsuranceVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => productService.updateInsurance(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.insurances() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: productKeys.insuranceDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


