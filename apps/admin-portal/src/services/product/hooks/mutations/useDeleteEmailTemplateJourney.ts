import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type DeleteEmailTemplateJourneyResponse = Awaited<
  ReturnType<typeof productService.deleteEmailTemplateJourney>
>;
type DeleteEmailTemplateJourneyVariables = Parameters<
  typeof productService.deleteEmailTemplateJourney
>[0];

export function useDeleteEmailTemplateJourney(
  options?: UseMutationOptions<
    DeleteEmailTemplateJourneyResponse,
    Error,
    DeleteEmailTemplateJourneyVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deleteEmailTemplateJourney,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.emailTemplates() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: productKeys.emailTemplateJourneyDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


