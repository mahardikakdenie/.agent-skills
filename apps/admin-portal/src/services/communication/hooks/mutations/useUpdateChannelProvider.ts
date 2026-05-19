import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { communicationApiService } from "../../api/communication.service";
import type { ChannelProviderPayload } from "../../api/communication.types";
import { communicationKeys } from "../../query-keys";

type UpdateChannelProviderResponse = Awaited<
  ReturnType<typeof communicationApiService.updateChannelProvider>
>;
type UpdateChannelProviderVariables = {
  id: string;
  data: Partial<ChannelProviderPayload>;
};

export function useUpdateChannelProvider(
  options?: UseMutationOptions<
    UpdateChannelProviderResponse,
    Error,
    UpdateChannelProviderVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      communicationApiService.updateChannelProvider(id, data),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: communicationKeys.channelProviderDetail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: communicationKeys.channelProviders(),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
