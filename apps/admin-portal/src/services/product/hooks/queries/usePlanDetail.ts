import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type PlanDetailResponse = Awaited<
  ReturnType<typeof productService.getPlanById>
>;

export function usePlanDetail(
  id: string,
  options?: Omit<UseQueryOptions<PlanDetailResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productKeys.planDetail(id),
    queryFn: () => productService.getPlanById(id),
    ...options,
  });
}
