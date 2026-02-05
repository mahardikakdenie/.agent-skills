import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type DeleteCampaignResponse = Awaited<
  ReturnType<typeof promotionService.deleteCampaign>
>;
type DeleteCampaignVariables = Parameters<typeof promotionService.deleteCampaign>[0];

export function useDeleteCampaign(
  options?: UseMutationOptions<DeleteCampaignResponse, Error, DeleteCampaignVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: promotionService.deleteCampaign,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.campaigns() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: promotionKeys.campaignDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


