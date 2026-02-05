import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type DeleteAccountResponse = Awaited<ReturnType<typeof authService.deleteAccount>>;
type DeleteAccountVariables = Parameters<typeof authService.deleteAccount>[0];

export function useDeleteAccount(
  options?: UseMutationOptions<DeleteAccountResponse, Error, DeleteAccountVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.deleteAccount,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: authKeys.accountDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


