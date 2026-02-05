import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type UpdatePermissionResponse = Awaited<
  ReturnType<typeof authService.updatePermission>
>;
type UpdatePermissionPayload = Parameters<typeof authService.updatePermission>[1];
type UpdatePermissionVariables = { id: string; payload: UpdatePermissionPayload };

export function useUpdatePermission(
  options?: UseMutationOptions<
    UpdatePermissionResponse,
    Error,
    UpdatePermissionVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => authService.updatePermission(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.permissions() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: authKeys.permissionDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


