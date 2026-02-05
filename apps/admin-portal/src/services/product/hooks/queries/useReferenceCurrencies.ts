import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type ReferenceCurrenciesResponse = Awaited<
  ReturnType<typeof productService.getReferenceCurrencies>
>;
type ReferenceCurrenciesParams = Parameters<
  typeof productService.getReferenceCurrencies
>[0];

export function useReferenceCurrencies(
  params?: ReferenceCurrenciesParams,
  options?: Omit<
    UseQueryOptions<ReferenceCurrenciesResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.referenceCurrencies(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => productService.getReferenceCurrencies(params),
    ...options,
  });
}
