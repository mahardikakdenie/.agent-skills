import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { sanctionService } from "../../api/sanction.service";
import { sanctionKeys } from "../../query-keys";

type UpdateBlacklistResponse = Awaited<
  ReturnType<typeof sanctionService.updateBlacklist>
>;
type UpdateBlacklistPayload = Parameters<typeof sanctionService.updateBlacklist>[1];
type UpdateBlacklistVariables = { id: string; payload: UpdateBlacklistPayload };

export function useUpdateBlacklist(
  options?: UseMutationOptions<UpdateBlacklistResponse, Error, UpdateBlacklistVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => sanctionService.updateBlacklist(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: sanctionKeys.blacklist() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: sanctionKeys.blacklistDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


