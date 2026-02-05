import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type EmailTagDetailResponse = Awaited<
  ReturnType<typeof productService.getEmailTagById>
>;

export function useEmailTagDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<EmailTagDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.emailTagDetail(id),
    queryFn: () => productService.getEmailTagById(id),
    ...options,
  });
}
