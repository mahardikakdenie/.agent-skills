import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { thirdPartyService } from "../../api/third-party.service";
import type { ChannelMappingPayload } from "../../api/third-party.types";
import { thirdPartyKeys } from "../../query-keys";

type CreateChannelMappingResponse = Awaited<
  ReturnType<typeof thirdPartyService.createChannelMapping>
>;

export function useCreateChannelMapping(
  options?: UseMutationOptions<
    CreateChannelMappingResponse,
    Error,
    ChannelMappingPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: thirdPartyService.createChannelMapping,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: thirdPartyKeys.channelMappings(),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
