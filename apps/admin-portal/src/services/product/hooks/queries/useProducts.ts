import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type ProductsResponse = Awaited<ReturnType<typeof productService.getProducts>>;
type ProductsParams = Parameters<typeof productService.getProducts>[0];

export function useProducts(
  params?: ProductsParams,
  options?: Omit<UseQueryOptions<ProductsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productKeys.productList(params as Record<string, unknown> | undefined),
    queryFn: () => productService.getProducts(params),
    ...options,
  });
}
