import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type InsuranceLegacyDetailResponse = Awaited<
  ReturnType<typeof productService.getInsuranceLegacyById>
>;

export function useInsuranceLegacyDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<InsuranceLegacyDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.insuranceLegacyDetail(id),
    queryFn: () => productService.getInsuranceLegacyById(id),
    ...options,
  });
}
