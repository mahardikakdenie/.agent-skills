import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type ProductDetailResponse = Awaited<
  ReturnType<typeof productService.getProductById>
>;

export function useProductDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<ProductDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.productDetail(id),
    queryFn: () => productService.getProductById(id),
    ...options,
  });
}
