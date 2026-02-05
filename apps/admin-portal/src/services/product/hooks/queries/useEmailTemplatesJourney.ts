import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type EmailTemplatesJourneyResponse = Awaited<
  ReturnType<typeof productService.getEmailTemplatesJourney>
>;
type EmailTemplatesJourneyParams = Parameters<
  typeof productService.getEmailTemplatesJourney
>[0];

export function useEmailTemplatesJourney(
  params?: EmailTemplatesJourneyParams,
  options?: Omit<
    UseQueryOptions<EmailTemplatesJourneyResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.emailTemplatesJourney(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => productService.getEmailTemplatesJourney(params),
    ...options,
  });
}
