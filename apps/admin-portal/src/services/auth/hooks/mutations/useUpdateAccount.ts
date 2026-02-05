import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type UpdateAccountResponse = Awaited<ReturnType<typeof authService.updateAccount>>;
type UpdateAccountPayload = Parameters<typeof authService.updateAccount>[1];
type UpdateAccountVariables = { id: string; payload: UpdateAccountPayload };

export function useUpdateAccount(
  options?: UseMutationOptions<UpdateAccountResponse, Error, UpdateAccountVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => authService.updateAccount(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: authKeys.accountDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


