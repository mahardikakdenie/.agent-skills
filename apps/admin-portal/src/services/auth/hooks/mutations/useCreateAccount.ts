import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type CreateAccountResponse = Awaited<ReturnType<typeof authService.createAccount>>;
type CreateAccountPayload = Parameters<typeof authService.createAccount>[0];

export function useCreateAccount(
  options?: UseMutationOptions<CreateAccountResponse, Error, CreateAccountPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.createAccount,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


