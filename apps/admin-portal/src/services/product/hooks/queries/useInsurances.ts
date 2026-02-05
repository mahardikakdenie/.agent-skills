import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type InsurancesResponse = Awaited<
  ReturnType<typeof productService.getInsurances>
>;
type InsurancesParams = Parameters<typeof productService.getInsurances>[0];

export function useInsurances(
  params?: InsurancesParams,
  options?: Omit<
    UseQueryOptions<InsurancesResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.insuranceList(params as Record<string, unknown> | undefined),
    queryFn: () => productService.getInsurances(params),
    ...options,
  });
}
