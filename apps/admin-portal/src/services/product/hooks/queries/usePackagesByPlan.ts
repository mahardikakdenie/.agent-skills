import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type PackagesByPlanResponse = Awaited<
  ReturnType<typeof productService.getPackagesByPlan>
>;
type PackagesByPlanParams = Parameters<typeof productService.getPackagesByPlan>[1];

export function usePackagesByPlan(
  planId: string,
  params?: PackagesByPlanParams,
  options?: Omit<
    UseQueryOptions<PackagesByPlanResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.packagesByPlan(
      planId,
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => productService.getPackagesByPlan(planId, params),
    ...options,
  });
}
