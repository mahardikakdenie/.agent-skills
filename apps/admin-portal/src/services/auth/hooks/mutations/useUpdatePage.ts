import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type UpdatePageResponse = Awaited<ReturnType<typeof authService.updatePage>>;
type UpdatePagePayload = Parameters<typeof authService.updatePage>[1];
type UpdatePageVariables = { id: string; payload: UpdatePagePayload };

export function useUpdatePage(
  options?: UseMutationOptions<UpdatePageResponse, Error, UpdatePageVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => authService.updatePage(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.pages() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: authKeys.pageDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


