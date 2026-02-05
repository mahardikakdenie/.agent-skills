import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type RemoveAccountInsurerResponse = Awaited<
  ReturnType<typeof authService.removeAccountInsurer>
>;
type RemoveAccountInsurerVariables = Parameters<
  typeof authService.removeAccountInsurer
>[0];

export function useRemoveAccountInsurer(
  options?: UseMutationOptions<
    RemoveAccountInsurerResponse,
    Error,
    RemoveAccountInsurerVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.removeAccountInsurer,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


