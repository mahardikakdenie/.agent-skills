import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type EmailTagsResponse = Awaited<
  ReturnType<typeof productService.getEmailTags>
>;
type EmailTagsParams = Parameters<typeof productService.getEmailTags>[0];

export function useEmailTags(
  params?: EmailTagsParams,
  options?: Omit<UseQueryOptions<EmailTagsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: productKeys.emailTagList(params as Record<string, unknown> | undefined),
    queryFn: () => productService.getEmailTags(params),
    ...options,
  });
}
