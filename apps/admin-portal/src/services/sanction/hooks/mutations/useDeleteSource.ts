import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { sanctionService } from "../../api/sanction.service";
import { sanctionKeys } from "../../query-keys";

type DeleteSourceResponse = Awaited<
  ReturnType<typeof sanctionService.deleteSource>
>;
type DeleteSourceVariables = Parameters<typeof sanctionService.deleteSource>[0];

export function useDeleteSource(
  options?: UseMutationOptions<DeleteSourceResponse, Error, DeleteSourceVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sanctionService.deleteSource,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: sanctionKeys.sources() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: sanctionKeys.sourceDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


