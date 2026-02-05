import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type RemoveGroupRoleResponse = Awaited<
  ReturnType<typeof authService.removeGroupRole>
>;
type RemoveGroupRoleVariables = Parameters<typeof authService.removeGroupRole>[0];

export function useRemoveGroupRole(
  options?: UseMutationOptions<
    RemoveGroupRoleResponse,
    Error,
    RemoveGroupRoleVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.removeGroupRole,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.groups() });
      queryClient.invalidateQueries({ queryKey: authKeys.roles() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


