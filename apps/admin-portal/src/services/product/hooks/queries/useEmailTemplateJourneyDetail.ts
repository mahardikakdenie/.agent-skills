import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type EmailTemplateJourneyDetailResponse = Awaited<
  ReturnType<typeof productService.getEmailTemplateJourneyById>
>;

export function useEmailTemplateJourneyDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<EmailTemplateJourneyDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.emailTemplateJourneyDetail(id),
    queryFn: () => productService.getEmailTemplateJourneyById(id),
    ...options,
  });
}
