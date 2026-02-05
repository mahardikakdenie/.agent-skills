import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type CreatePermissionResponse = Awaited<
  ReturnType<typeof authService.createPermission>
>;
type CreatePermissionPayload = Parameters<typeof authService.createPermission>[0];

export function useCreatePermission(
  options?: UseMutationOptions<
    CreatePermissionResponse,
    Error,
    CreatePermissionPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.createPermission,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.permissions() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


