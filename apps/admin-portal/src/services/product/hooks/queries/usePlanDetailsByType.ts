import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type PlanDetailsResponse = Awaited<
  ReturnType<typeof productService.getPlanDetails>
>;

export function usePlanDetailsByType(
  planId: string,
  type: string,
  options?: Omit<
    UseQueryOptions<PlanDetailsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.planDetails(planId, type),
    queryFn: () => productService.getPlanDetails(planId, type),
    ...options,
  });
}
