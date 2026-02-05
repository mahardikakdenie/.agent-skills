import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CategoriesResponse = Awaited<
  ReturnType<typeof productService.getCategories>
>;
type CategoriesParams = Parameters<typeof productService.getCategories>[0];

export function useCategories(
  params?: CategoriesParams,
  options?: Omit<UseQueryOptions<CategoriesResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productKeys.categoryList(params as Record<string, unknown> | undefined),
    queryFn: () => productService.getCategories(params),
    ...options,
  });
}
