import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { transactionService } from "../../api/transaction.service";
import { transactionKeys } from "../../query-keys";

type UpdateCampaignReportResponse = Awaited<
  ReturnType<typeof transactionService.updateCampaignReport>
>;
type UpdateCampaignReportPayload = Parameters<
  typeof transactionService.updateCampaignReport
>[1];
type UpdateCampaignReportVariables = {
  id: string;
  payload: UpdateCampaignReportPayload;
};

export function useUpdateCampaignReport(
  options?: UseMutationOptions<
    UpdateCampaignReportResponse,
    Error,
    UpdateCampaignReportVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      transactionService.updateCampaignReport(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.campaignReport(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


