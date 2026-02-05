import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type CreateEmailTemplateJourneyResponse = Awaited<
  ReturnType<typeof productService.createEmailTemplateJourney>
>;
type CreateEmailTemplateJourneyPayload = Parameters<
  typeof productService.createEmailTemplateJourney
>[0];

export function useCreateEmailTemplateJourney(
  options?: UseMutationOptions<
    CreateEmailTemplateJourneyResponse,
    Error,
    CreateEmailTemplateJourneyPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createEmailTemplateJourney,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.emailTemplates() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


