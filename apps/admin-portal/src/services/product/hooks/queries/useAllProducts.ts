import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type ProductsParams = Parameters<typeof productService.getProducts>[0];
type AllProductsResponse = Awaited<ReturnType<typeof productService.getProducts>>;

export function useAllProducts(
  params?: ProductsParams,
  options?: Omit<
    UseQueryOptions<AllProductsResponse[], Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.productAll(params as Record<string, unknown> | undefined),
    queryFn: async () => {
      const allProducts: AllProductsResponse[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const response: any = await productService.getProducts({
          ...(params || {}),
          page: currentPage,
          pageSize: 100,
        });

        if (response?.data) {
          allProducts.push(...response.data);
          hasMore = currentPage < (response?.meta?.pageTotal || 1);
          currentPage += 1;
        } else {
          hasMore = false;
        }
      }

      return allProducts;
    },
    ...options,
  });
}

