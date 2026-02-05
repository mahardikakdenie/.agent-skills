import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type DeleteRolePermissionResponse = Awaited<
  ReturnType<typeof authService.deleteRolePermission>
>;
type DeleteRolePermissionVariables = Parameters<
  typeof authService.deleteRolePermission
>[0];

export function useDeleteRolePermission(
  options?: UseMutationOptions<
    DeleteRolePermissionResponse,
    Error,
    DeleteRolePermissionVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.deleteRolePermission,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.rolePermissions() });
      queryClient.invalidateQueries({ queryKey: authKeys.permissions() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


