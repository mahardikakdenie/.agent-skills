import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type AccountChannelsResponse = Awaited<
  ReturnType<typeof authService.getAccountChannelsByAccount>
>;

export function useAccountChannelsByAccount(
  accountId: string,
  options?: Omit<
    UseQueryOptions<AccountChannelsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: authKeys.accountChannels(accountId),
    queryFn: () => authService.getAccountChannelsByAccount(accountId),
    ...options,
  });
}
