import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type PlanLegacyDetailResponse = Awaited<
  ReturnType<typeof productService.getPlanLegacyById>
>;

export function usePlanLegacyDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<PlanLegacyDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.planLegacyDetail(id),
    queryFn: () => productService.getPlanLegacyById(id),
    ...options,
  });
}
