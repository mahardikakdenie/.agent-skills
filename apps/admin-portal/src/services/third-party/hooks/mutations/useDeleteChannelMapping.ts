import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { thirdPartyService } from "../../api/third-party.service";
import { thirdPartyKeys } from "../../query-keys";

type DeleteChannelMappingResponse = Awaited<
  ReturnType<typeof thirdPartyService.deleteChannelMapping>
>;

export function useDeleteChannelMapping(
  options?: UseMutationOptions<DeleteChannelMappingResponse, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: thirdPartyService.deleteChannelMapping,
    ...options,
    onSuccess: (data, id, context, mutation) => {
      queryClient.removeQueries({
        queryKey: thirdPartyKeys.channelMappingDetail(id),
      });
      queryClient.invalidateQueries({
        queryKey: thirdPartyKeys.channelMappings(),
      });
      options?.onSuccess?.(data, id, context, mutation);
    },
  });
}
