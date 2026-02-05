import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type InsurancesLegacyResponse = Awaited<
  ReturnType<typeof productService.getInsurancesLegacy>
>;
type InsurancesLegacyParams = Parameters<
  typeof productService.getInsurancesLegacy
>[0];

export function useInsurancesLegacy(
  params?: InsurancesLegacyParams,
  options?: Omit<
    UseQueryOptions<InsurancesLegacyResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.insuranceLegacyList(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => productService.getInsurancesLegacy(params),
    ...options,
  });
}
