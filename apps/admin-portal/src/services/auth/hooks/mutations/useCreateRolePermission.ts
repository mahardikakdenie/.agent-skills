import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type CreateRolePermissionResponse = Awaited<
  ReturnType<typeof authService.createRolePermission>
>;
type CreateRolePermissionPayload = Parameters<
  typeof authService.createRolePermission
>[0];

export function useCreateRolePermission(
  options?: UseMutationOptions<
    CreateRolePermissionResponse,
    Error,
    CreateRolePermissionPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.createRolePermission,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.rolePermissions() });
      queryClient.invalidateQueries({ queryKey: authKeys.permissions() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


