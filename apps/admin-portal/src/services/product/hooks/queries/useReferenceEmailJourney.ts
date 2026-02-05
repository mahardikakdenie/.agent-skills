import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type ReferenceEmailJourneyResponse = Awaited<
  ReturnType<typeof productService.getReferenceEmailJourney>
>;
type ReferenceEmailJourneyParams = Parameters<
  typeof productService.getReferenceEmailJourney
>[0];

export function useReferenceEmailJourney(
  params?: ReferenceEmailJourneyParams,
  options?: Omit<
    UseQueryOptions<ReferenceEmailJourneyResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.referenceEmailJourney(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => productService.getReferenceEmailJourney(params),
    ...options,
  });
}
