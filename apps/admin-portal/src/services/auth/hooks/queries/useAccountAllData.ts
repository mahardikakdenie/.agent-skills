import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AccountAllDataResponse = Awaited<
  ReturnType<typeof authService.getAccountAllDataPagination>
>;

export function useAccountAllData(
  params?: Record<string, unknown>,
  options?: Omit<
    UseQueryOptions<AccountAllDataResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: authKeys.accountAllDataList(params),
    queryFn: () => authService.getAccountAllDataPagination(params),
    ...options,
  });
}
