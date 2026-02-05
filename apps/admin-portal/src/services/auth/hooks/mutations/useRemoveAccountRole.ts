import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type RemoveAccountRoleResponse = Awaited<
  ReturnType<typeof authService.removeAccountRole>
>;
type RemoveAccountRoleVariables = Parameters<typeof authService.removeAccountRole>[0];

export function useRemoveAccountRole(
  options?: UseMutationOptions<
    RemoveAccountRoleResponse,
    Error,
    RemoveAccountRoleVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.removeAccountRole,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


