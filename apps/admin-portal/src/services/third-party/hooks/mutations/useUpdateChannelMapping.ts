import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { thirdPartyService } from "../../api/third-party.service";
import type { ChannelMappingPayload } from "../../api/third-party.types";
import { thirdPartyKeys } from "../../query-keys";

type UpdateChannelMappingResponse = Awaited<
  ReturnType<typeof thirdPartyService.updateChannelMapping>
>;
type UpdateChannelMappingVariables = {
  id: string;
  data: Partial<ChannelMappingPayload>;
};

export function useUpdateChannelMapping(
  options?: UseMutationOptions<
    UpdateChannelMappingResponse,
    Error,
    UpdateChannelMappingVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => thirdPartyService.updateChannelMapping(id, data),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: thirdPartyKeys.channelMappingDetail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: thirdPartyKeys.channelMappings(),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
