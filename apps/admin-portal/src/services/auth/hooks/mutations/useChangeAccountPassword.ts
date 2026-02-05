import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type ChangePasswordResponse = Awaited<
  ReturnType<typeof authService.changeAccountPassword>
>;
type ChangePasswordPayload = Parameters<typeof authService.changeAccountPassword>[1];
type ChangePasswordVariables = { id: string; payload: ChangePasswordPayload };

export function useChangeAccountPassword(
  options?: UseMutationOptions<
    ChangePasswordResponse,
    Error,
    ChangePasswordVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => authService.changeAccountPassword(id, payload),
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


