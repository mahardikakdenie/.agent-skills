import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { internalService } from "../../api/internal.service";
import { internalKeys } from "../../query-keys";

type DeleteCookieResponse = Awaited<
  ReturnType<typeof internalService.deleteCookieByKey>
>;
type DeleteCookieVariables = Parameters<
  typeof internalService.deleteCookieByKey
>[0];

export function useDeleteCookie(
  options?: UseMutationOptions<DeleteCookieResponse, Error, DeleteCookieVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: internalService.deleteCookieByKey,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: internalKeys.cookie() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: internalKeys.cookieByKey(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


