import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AccountResponse = Awaited<ReturnType<typeof authService.getAccountById>>;

export function useAccountDetail(
  id: string,
  options?: Omit<UseQueryOptions<AccountResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: authKeys.accountDetail(id),
    queryFn: () => authService.getAccountById(id),
    ...options,
  });
}
