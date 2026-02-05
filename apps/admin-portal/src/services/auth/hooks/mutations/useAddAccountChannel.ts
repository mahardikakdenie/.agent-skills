import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AddAccountChannelResponse = Awaited<
  ReturnType<typeof authService.addAccountChannel>
>;
type AddAccountChannelPayload = Parameters<
  typeof authService.addAccountChannel
>[0];

export function useAddAccountChannel(
  options?: UseMutationOptions<
    AddAccountChannelResponse,
    Error,
    AddAccountChannelPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.addAccountChannel,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


