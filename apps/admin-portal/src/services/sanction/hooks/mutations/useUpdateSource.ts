import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { sanctionService } from "../../api/sanction.service";
import { sanctionKeys } from "../../query-keys";

type UpdateSourceResponse = Awaited<
  ReturnType<typeof sanctionService.updateSource>
>;
type UpdateSourcePayload = Parameters<typeof sanctionService.updateSource>[1];
type UpdateSourceVariables = { id: string; payload: UpdateSourcePayload };

export function useUpdateSource(
  options?: UseMutationOptions<UpdateSourceResponse, Error, UpdateSourceVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => sanctionService.updateSource(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: sanctionKeys.sources() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: sanctionKeys.sourceDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


