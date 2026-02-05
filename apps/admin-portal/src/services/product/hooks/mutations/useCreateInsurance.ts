import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CreateInsuranceResponse = Awaited<
  ReturnType<typeof productService.createInsurance>
>;
type CreateInsurancePayload = Parameters<typeof productService.createInsurance>[0];

export function useCreateInsurance(
  options?: UseMutationOptions<CreateInsuranceResponse, Error, CreateInsurancePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createInsurance,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.insurances() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


