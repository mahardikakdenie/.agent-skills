import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { communicationApiService } from "../../api/communication.service";
import { communicationKeys } from "../../query-keys";

type DeleteChannelProviderResponse = Awaited<
  ReturnType<typeof communicationApiService.deleteChannelProvider>
>;

export function useDeleteChannelProvider(
  options?: UseMutationOptions<DeleteChannelProviderResponse, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: communicationApiService.deleteChannelProvider,
    ...options,
    onSuccess: (data, id, context, mutation) => {
      queryClient.removeQueries({
        queryKey: communicationKeys.channelProviderDetail(id),
      });
      queryClient.invalidateQueries({
        queryKey: communicationKeys.channelProviders(),
      });
      options?.onSuccess?.(data, id, context, mutation);
    },
  });
}
