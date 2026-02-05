import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type UpdateRoleResponse = Awaited<ReturnType<typeof authService.updateRole>>;
type UpdateRolePayload = Parameters<typeof authService.updateRole>[1];
type UpdateRoleVariables = { id: string; payload: UpdateRolePayload };

export function useUpdateRole(
  options?: UseMutationOptions<UpdateRoleResponse, Error, UpdateRoleVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => authService.updateRole(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.roles() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: authKeys.roleDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


