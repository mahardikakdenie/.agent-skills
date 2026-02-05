import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type CreateGroupResponse = Awaited<ReturnType<typeof authService.createGroup>>;
type CreateGroupPayload = Parameters<typeof authService.createGroup>[0];

export function useCreateGroup(
  options?: UseMutationOptions<CreateGroupResponse, Error, CreateGroupPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.createGroup,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.groups() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


