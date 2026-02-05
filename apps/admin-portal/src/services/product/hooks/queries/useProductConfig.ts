import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type ProductConfigResponse = Awaited<
  ReturnType<typeof productService.getProductConfigByType>
>;

export function useProductConfig(
  type: string,
  options?: Omit<
    UseQueryOptions<ProductConfigResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.productConfig(type),
    queryFn: () => productService.getProductConfigByType(type),
    ...options,
  });
}
