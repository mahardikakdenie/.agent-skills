import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { sanctionService } from "../../api/sanction.service";
import { sanctionKeys } from "../../query-keys";

type CreateSourceResponse = Awaited<
  ReturnType<typeof sanctionService.createSource>
>;
type CreateSourcePayload = Parameters<typeof sanctionService.createSource>[0];

export function useCreateSource(
  options?: UseMutationOptions<CreateSourceResponse, Error, CreateSourcePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sanctionService.createSource,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: sanctionKeys.sources() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


