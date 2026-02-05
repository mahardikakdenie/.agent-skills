import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type UpdateEmailTemplateJourneyResponse = Awaited<
  ReturnType<typeof productService.updateEmailTemplateJourney>
>;
type UpdateEmailTemplateJourneyPayload = Parameters<
  typeof productService.updateEmailTemplateJourney
>[1];
type UpdateEmailTemplateJourneyVariables = {
  id: string;
  payload: UpdateEmailTemplateJourneyPayload;
};

export function useUpdateEmailTemplateJourney(
  options?: UseMutationOptions<
    UpdateEmailTemplateJourneyResponse,
    Error,
    UpdateEmailTemplateJourneyVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      productService.updateEmailTemplateJourney(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.emailTemplates() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: productKeys.emailTemplateJourneyDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


