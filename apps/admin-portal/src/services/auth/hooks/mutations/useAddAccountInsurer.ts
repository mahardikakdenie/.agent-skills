import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AddAccountInsurerResponse = Awaited<
  ReturnType<typeof authService.addAccountInsurer>
>;
type AddAccountInsurerPayload = Parameters<
  typeof authService.addAccountInsurer
>[0];

export function useAddAccountInsurer(
  options?: UseMutationOptions<
    AddAccountInsurerResponse,
    Error,
    AddAccountInsurerPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.addAccountInsurer,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


