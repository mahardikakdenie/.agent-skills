import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ImportClaimsJsonResponse = Awaited<
  ReturnType<typeof claimsService.importClaimsAsJson>
>;
type ImportClaimsJsonPayload = Parameters<
  typeof claimsService.importClaimsAsJson
>[0];

export function useImportClaimsAsJson(
  options?: UseMutationOptions<
    ImportClaimsJsonResponse,
    Error,
    ImportClaimsJsonPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimsService.importClaimsAsJson,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() });
      queryClient.invalidateQueries({ queryKey: claimKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: claimKeys.listLimit() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


