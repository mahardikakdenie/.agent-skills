import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { communicationApiService } from "../../api/communication.service";
import type { ChannelProviderPayload } from "../../api/communication.types";
import { communicationKeys } from "../../query-keys";

type CreateChannelProviderResponse = Awaited<
  ReturnType<typeof communicationApiService.createChannelProvider>
>;

export function useCreateChannelProvider(
  options?: UseMutationOptions<
    CreateChannelProviderResponse,
    Error,
    ChannelProviderPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: communicationApiService.createChannelProvider,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: communicationKeys.channelProviders(),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
