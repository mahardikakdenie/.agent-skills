import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AccountAllDataDetailResponse = Awaited<
  ReturnType<typeof authService.getAccountAllDataById>
>;

export function useAccountAllDataDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<AccountAllDataDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: authKeys.accountAllDataDetail(id),
    queryFn: () => authService.getAccountAllDataById(id),
    ...options,
  });
}
