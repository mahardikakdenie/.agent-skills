import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type InsuranceDetailResponse = Awaited<
  ReturnType<typeof productService.getInsuranceById>
>;

export function useInsuranceDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<InsuranceDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.insuranceDetail(id),
    queryFn: () => productService.getInsuranceById(id),
    ...options,
  });
}
