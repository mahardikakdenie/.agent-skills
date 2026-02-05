import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AccountPartnersResponse = Awaited<
  ReturnType<typeof authService.getAccountPartners>
>;

export function useAccountPartners(
  params?: Record<string, unknown>,
  options?: Omit<
    UseQueryOptions<AccountPartnersResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: authKeys.accountPartners(params),
    queryFn: () => authService.getAccountPartners(params),
    ...options,
  });
}
