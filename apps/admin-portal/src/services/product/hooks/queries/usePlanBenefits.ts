import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type PlanBenefitsResponse = Awaited<
  ReturnType<typeof productService.getPlanBenefits>
>;

export function usePlanBenefits(
  planId: string,
  options?: Omit<
    UseQueryOptions<PlanBenefitsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.planBenefits(planId),
    queryFn: () => productService.getPlanBenefits(planId),
    ...options,
  });
}
