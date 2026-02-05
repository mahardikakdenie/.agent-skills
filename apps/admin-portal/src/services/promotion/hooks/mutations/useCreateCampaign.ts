import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type CreateCampaignResponse = Awaited<
  ReturnType<typeof promotionService.createCampaign>
>;
type CreateCampaignPayload = Parameters<typeof promotionService.createCampaign>[0];

export function useCreateCampaign(
  options?: UseMutationOptions<CreateCampaignResponse, Error, CreateCampaignPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: promotionService.createCampaign,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.campaigns() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


