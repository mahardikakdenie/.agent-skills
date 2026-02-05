import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CategoryDetailResponse = Awaited<
  ReturnType<typeof productService.getCategoryById>
>;

export function useCategoryDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<CategoryDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.categoryDetail(id),
    queryFn: () => productService.getCategoryById(id),
    ...options,
  });
}
