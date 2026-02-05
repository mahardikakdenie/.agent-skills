import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type DeleteRoleResponse = Awaited<ReturnType<typeof authService.deleteRole>>;
type DeleteRoleVariables = Parameters<typeof authService.deleteRole>[0];

export function useDeleteRole(
  options?: UseMutationOptions<DeleteRoleResponse, Error, DeleteRoleVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.deleteRole,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.roles() });
      if (variables) {
        queryClient.invalidateQueries({ queryKey: authKeys.roleDetail(variables) });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


