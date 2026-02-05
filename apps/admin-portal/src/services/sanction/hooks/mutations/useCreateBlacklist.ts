import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { sanctionService } from "../../api/sanction.service";
import { sanctionKeys } from "../../query-keys";

type CreateBlacklistResponse = Awaited<
  ReturnType<typeof sanctionService.createBlacklist>
>;
type CreateBlacklistPayload = Parameters<typeof sanctionService.createBlacklist>[0];

export function useCreateBlacklist(
  options?: UseMutationOptions<CreateBlacklistResponse, Error, CreateBlacklistPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sanctionService.createBlacklist,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: sanctionKeys.blacklist() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


