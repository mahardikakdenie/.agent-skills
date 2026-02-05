import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type PackagesResponse = Awaited<ReturnType<typeof productService.getPackages>>;
type PackagesParams = Parameters<typeof productService.getPackages>[0];

export function usePackages(
  params?: PackagesParams,
  options?: Omit<UseQueryOptions<PackagesResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productKeys.packageList(params as Record<string, unknown> | undefined),
    queryFn: () => productService.getPackages(params),
    ...options,
  });
}
