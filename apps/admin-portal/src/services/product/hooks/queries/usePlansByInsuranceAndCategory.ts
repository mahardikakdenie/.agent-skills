import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type PlansByInsuranceCategoryResponse = Awaited<
  ReturnType<typeof productService.getPlansByInsuranceAndCategory>
>;
type PlansByInsuranceCategoryParams = Parameters<
  typeof productService.getPlansByInsuranceAndCategory
>[2];

export function usePlansByInsuranceAndCategory(
  insuranceId: string,
  category: string,
  params?: PlansByInsuranceCategoryParams,
  options?: Omit<
    UseQueryOptions<PlansByInsuranceCategoryResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.plansByInsuranceAndCategory(
      insuranceId,
      category,
      params as Record<string, unknown> | undefined
    ),
    queryFn: () =>
      productService.getPlansByInsuranceAndCategory(
        insuranceId,
        category,
        params
      ),
    ...options,
  });
}
