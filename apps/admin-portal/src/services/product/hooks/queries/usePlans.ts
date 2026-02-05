import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type PlansResponse = Awaited<ReturnType<typeof productService.getPlans>>;
type PlansParams = Parameters<typeof productService.getPlans>[0];

export function usePlans(
  params?: PlansParams,
  options?: Omit<UseQueryOptions<PlansResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productKeys.planList(params as Record<string, unknown> | undefined),
    queryFn: () => productService.getPlans(params),
    ...options,
  });
}
