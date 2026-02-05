import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type CreatePageResponse = Awaited<ReturnType<typeof authService.createPage>>;
type CreatePagePayload = Parameters<typeof authService.createPage>[0];

export function useCreatePage(
  options?: UseMutationOptions<CreatePageResponse, Error, CreatePagePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.createPage,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.pages() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


