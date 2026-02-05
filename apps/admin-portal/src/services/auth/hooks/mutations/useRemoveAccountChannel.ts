import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type RemoveAccountChannelResponse = Awaited<
  ReturnType<typeof authService.removeAccountChannel>
>;
type RemoveAccountChannelVariables = Parameters<
  typeof authService.removeAccountChannel
>[0];

export function useRemoveAccountChannel(
  options?: UseMutationOptions<
    RemoveAccountChannelResponse,
    Error,
    RemoveAccountChannelVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.removeAccountChannel,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


