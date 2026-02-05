import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type PlansByProductIdsResponse = Awaited<
  ReturnType<typeof productService.getPlansByProductIds>
>;
type PlansByProductIdsParams = Parameters<
  typeof productService.getPlansByProductIds
>[1];

export function usePlansByProductIds(
  productIds: string[],
  params?: PlansByProductIdsParams,
  options?: Omit<
    UseQueryOptions<PlansByProductIdsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.plansByProductIds(
      productIds,
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => productService.getPlansByProductIds(productIds, params),
    ...options,
  });
}
