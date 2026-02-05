import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { internalService } from "../../api/internal.service";
import { internalKeys } from "../../query-keys";

type SetCookieResponse = Awaited<ReturnType<typeof internalService.setCookie>>;
type SetCookiePayload = Parameters<typeof internalService.setCookie>[0];

export function useSetCookie(
  options?: UseMutationOptions<SetCookieResponse, Error, SetCookiePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: internalService.setCookie,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: internalKeys.cookie() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


