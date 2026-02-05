import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type RemoveAccountGroupResponse = Awaited<
  ReturnType<typeof authService.removeAccountGroup>
>;
type RemoveAccountGroupVariables = Parameters<
  typeof authService.removeAccountGroup
>[0];

export function useRemoveAccountGroup(
  options?: UseMutationOptions<
    RemoveAccountGroupResponse,
    Error,
    RemoveAccountGroupVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.removeAccountGroup,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


