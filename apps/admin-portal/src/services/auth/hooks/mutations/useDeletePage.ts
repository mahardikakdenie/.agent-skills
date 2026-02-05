import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type DeletePageResponse = Awaited<ReturnType<typeof authService.deletePage>>;
type DeletePageVariables = Parameters<typeof authService.deletePage>[0];

export function useDeletePage(
  options?: UseMutationOptions<DeletePageResponse, Error, DeletePageVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.deletePage,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.pages() });
      if (variables) {
        queryClient.invalidateQueries({ queryKey: authKeys.pageDetail(variables) });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


