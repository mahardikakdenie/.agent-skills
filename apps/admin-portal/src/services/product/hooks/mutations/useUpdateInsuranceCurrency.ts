import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type UpdateInsuranceCurrencyResponse = Awaited<
  ReturnType<typeof productService.updateInsuranceCurrency>
>;
type UpdateInsuranceCurrencyPayload = Parameters<
  typeof productService.updateInsuranceCurrency
>[1];
type UpdateInsuranceCurrencyVariables = {
  insuranceId: string;
  payload: UpdateInsuranceCurrencyPayload;
};

export function useUpdateInsuranceCurrency(
  options?: UseMutationOptions<
    UpdateInsuranceCurrencyResponse,
    Error,
    UpdateInsuranceCurrencyVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ insuranceId, payload }) =>
      productService.updateInsuranceCurrency(insuranceId, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      if (variables?.insuranceId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.insuranceCurrencies(variables.insuranceId),
        });
      }
      queryClient.invalidateQueries({ queryKey: productKeys.insurances() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


