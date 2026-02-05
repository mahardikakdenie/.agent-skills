import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ImportClaimsResponse = Awaited<
  ReturnType<typeof claimsService.importClaims>
>;
type ImportClaimsPayload = Parameters<typeof claimsService.importClaims>[0];

export function useImportClaims(
  options?: UseMutationOptions<ImportClaimsResponse, Error, ImportClaimsPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimsService.importClaims,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() });
      queryClient.invalidateQueries({ queryKey: claimKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: claimKeys.listLimit() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


