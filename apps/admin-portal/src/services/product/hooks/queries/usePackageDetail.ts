import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type PackageDetailResponse = Awaited<
  ReturnType<typeof productService.getPackageById>
>;

export function usePackageDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<PackageDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.packageDetail(id),
    queryFn: () => productService.getPackageById(id),
    ...options,
  });
}
