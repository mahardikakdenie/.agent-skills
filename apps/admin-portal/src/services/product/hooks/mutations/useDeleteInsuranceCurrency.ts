import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type DeleteInsuranceCurrencyResponse = Awaited<
  ReturnType<typeof productService.deleteInsuranceCurrency>
>;
type DeleteInsuranceCurrencyVariables = {
  insuranceId: string;
  currencyId: string;
};

export function useDeleteInsuranceCurrency(
  options?: UseMutationOptions<
    DeleteInsuranceCurrencyResponse,
    Error,
    DeleteInsuranceCurrencyVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ insuranceId, currencyId }) =>
      productService.deleteInsuranceCurrency(insuranceId, currencyId),
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


