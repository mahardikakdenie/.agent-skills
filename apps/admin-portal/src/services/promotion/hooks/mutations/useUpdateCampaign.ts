import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type UpdateCampaignResponse = Awaited<
  ReturnType<typeof promotionService.updateCampaign>
>;
type UpdateCampaignPayload = Parameters<typeof promotionService.updateCampaign>[1];
type UpdateCampaignVariables = { id: string; payload: UpdateCampaignPayload };

export function useUpdateCampaign(
  options?: UseMutationOptions<UpdateCampaignResponse, Error, UpdateCampaignVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => promotionService.updateCampaign(id, payload),
    ...options,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: promotionKeys.campaigns() });
      if (variables?.id) {
        await queryClient.invalidateQueries({
          queryKey: promotionKeys.campaignDetail(variables.id),
        });
      }
      await options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


