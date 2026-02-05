import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type PlanChannelsResponse = Awaited<
  ReturnType<typeof productService.getPlanChannels>
>;

export function usePlanChannels(
  planId: string,
  options?: Omit<
    UseQueryOptions<PlanChannelsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.planChannels(planId),
    queryFn: () => productService.getPlanChannels(planId),
    ...options,
  });
}
