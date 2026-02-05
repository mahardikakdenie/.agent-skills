import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AccountInsurersResponse = Awaited<
  ReturnType<typeof authService.getAccountInsurersByAccount>
>;

export function useAccountInsurersByAccount(
  accountId: string,
  options?: Omit<
    UseQueryOptions<AccountInsurersResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: authKeys.accountInsurers(accountId),
    queryFn: () => authService.getAccountInsurersByAccount(accountId),
    ...options,
  });
}
