import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type UpdateGroupResponse = Awaited<ReturnType<typeof authService.updateGroup>>;
type UpdateGroupPayload = Parameters<typeof authService.updateGroup>[1];
type UpdateGroupVariables = { id: string; payload: UpdateGroupPayload };

export function useUpdateGroup(
  options?: UseMutationOptions<UpdateGroupResponse, Error, UpdateGroupVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => authService.updateGroup(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.groups() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: authKeys.groupDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


