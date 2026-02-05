import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type CreateRoleResponse = Awaited<ReturnType<typeof authService.createRole>>;
type CreateRolePayload = Parameters<typeof authService.createRole>[0];

export function useCreateRole(
  options?: UseMutationOptions<CreateRoleResponse, Error, CreateRolePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.createRole,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.roles() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


