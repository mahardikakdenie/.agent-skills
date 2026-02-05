import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type DeleteGroupResponse = Awaited<ReturnType<typeof authService.deleteGroup>>;
type DeleteGroupVariables = Parameters<typeof authService.deleteGroup>[0];

export function useDeleteGroup(
  options?: UseMutationOptions<DeleteGroupResponse, Error, DeleteGroupVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.deleteGroup,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.groups() });
      if (variables) {
        queryClient.invalidateQueries({ queryKey: authKeys.groupDetail(variables) });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


