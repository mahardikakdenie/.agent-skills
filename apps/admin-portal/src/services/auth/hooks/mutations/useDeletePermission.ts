import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type DeletePermissionResponse = Awaited<
  ReturnType<typeof authService.deletePermission>
>;
type DeletePermissionVariables = Parameters<typeof authService.deletePermission>[0];

export function useDeletePermission(
  options?: UseMutationOptions<
    DeletePermissionResponse,
    Error,
    DeletePermissionVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.deletePermission,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.permissions() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: authKeys.permissionDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


