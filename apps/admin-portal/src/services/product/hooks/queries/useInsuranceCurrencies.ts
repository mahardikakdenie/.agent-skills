import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type InsuranceCurrenciesResponse = Awaited<
  ReturnType<typeof productService.getInsuranceCurrencies>
>;
type InsuranceCurrenciesParams = Parameters<
  typeof productService.getInsuranceCurrencies
>[1];

export function useInsuranceCurrencies(
  insuranceId: string,
  params?: InsuranceCurrenciesParams,
  options?: Omit<
    UseQueryOptions<InsuranceCurrenciesResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.insuranceCurrencies(
      insuranceId,
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => productService.getInsuranceCurrencies(insuranceId, params),
    ...options,
  });
}
