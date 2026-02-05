import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type ReferenceHospitalsResponse = Awaited<
  ReturnType<typeof productService.getReferenceHospitalList>
>;
type ReferenceHospitalsParams = Parameters<
  typeof productService.getReferenceHospitalList
>[0];

export function useReferenceHospitals(
  params?: ReferenceHospitalsParams,
  options?: Omit<
    UseQueryOptions<ReferenceHospitalsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.referenceHospitals(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => productService.getReferenceHospitalList(params),
    ...options,
  });
}
