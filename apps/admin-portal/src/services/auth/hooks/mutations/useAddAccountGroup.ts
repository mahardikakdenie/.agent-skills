import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AddAccountGroupResponse = Awaited<
  ReturnType<typeof authService.addAccountGroup>
>;
type AddAccountGroupPayload = Parameters<typeof authService.addAccountGroup>[0];

export function useAddAccountGroup(
  options?: UseMutationOptions<
    AddAccountGroupResponse,
    Error,
    AddAccountGroupPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.addAccountGroup,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


