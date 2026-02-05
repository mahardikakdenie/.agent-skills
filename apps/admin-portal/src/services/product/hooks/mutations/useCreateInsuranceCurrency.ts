import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CreateInsuranceCurrencyResponse = Awaited<
  ReturnType<typeof productService.createInsuranceCurrency>
>;
type CreateInsuranceCurrencyPayload = Parameters<
  typeof productService.createInsuranceCurrency
>[1];
type CreateInsuranceCurrencyVariables = {
  insuranceId: string;
  payload: CreateInsuranceCurrencyPayload;
};

export function useCreateInsuranceCurrency(
  options?: UseMutationOptions<
    CreateInsuranceCurrencyResponse,
    Error,
    CreateInsuranceCurrencyVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ insuranceId, payload }) =>
      productService.createInsuranceCurrency(insuranceId, payload),
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


