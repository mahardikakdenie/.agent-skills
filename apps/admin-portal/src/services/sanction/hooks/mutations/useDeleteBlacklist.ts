import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { sanctionService } from "../../api/sanction.service";
import { sanctionKeys } from "../../query-keys";

type DeleteBlacklistResponse = Awaited<
  ReturnType<typeof sanctionService.deleteBlacklist>
>;
type DeleteBlacklistVariables = Parameters<typeof sanctionService.deleteBlacklist>[0];

export function useDeleteBlacklist(
  options?: UseMutationOptions<DeleteBlacklistResponse, Error, DeleteBlacklistVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sanctionService.deleteBlacklist,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: sanctionKeys.blacklist() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: sanctionKeys.blacklistDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


