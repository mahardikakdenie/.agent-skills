import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AddGroupRoleResponse = Awaited<ReturnType<typeof authService.addGroupRole>>;
type AddGroupRolePayload = Parameters<typeof authService.addGroupRole>[0];

export function useAddGroupRole(
  options?: UseMutationOptions<AddGroupRoleResponse, Error, AddGroupRolePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.addGroupRole,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.groups() });
      queryClient.invalidateQueries({ queryKey: authKeys.roles() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


