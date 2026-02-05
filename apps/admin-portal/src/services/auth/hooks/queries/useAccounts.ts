import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AccountsResponse = Awaited<ReturnType<typeof authService.getAccounts>>;

export function useAccounts(
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<AccountsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: authKeys.accountList(params),
    queryFn: () => authService.getAccounts(params),
    ...options,
  });
}
