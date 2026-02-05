import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CategoriesByChannelResponse = Awaited<
  ReturnType<typeof productService.getCategoriesByChannelId>
>;

export function useCategoriesByChannel(
  channelId: string,
  options?: Omit<
    UseQueryOptions<CategoriesByChannelResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.categoriesByChannel(channelId),
    queryFn: () => productService.getCategoriesByChannelId(channelId),
    ...options,
  });
}
