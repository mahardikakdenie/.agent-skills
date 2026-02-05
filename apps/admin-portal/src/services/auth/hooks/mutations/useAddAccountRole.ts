import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AddAccountRoleResponse = Awaited<
  ReturnType<typeof authService.addAccountRole>
>;
type AddAccountRolePayload = Parameters<typeof authService.addAccountRole>[0];

export function useAddAccountRole(
  options?: UseMutationOptions<AddAccountRoleResponse, Error, AddAccountRolePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.addAccountRole,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


