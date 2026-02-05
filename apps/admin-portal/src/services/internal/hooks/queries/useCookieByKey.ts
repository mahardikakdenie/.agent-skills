import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { internalService } from "../../api/internal.service";
import { internalKeys } from "../../query-keys";

type CookieByKeyResponse = Awaited<
  ReturnType<typeof internalService.getCookieByKey>
>;

export function useCookieByKey(
  key: string,
  options?: Omit<
    UseQueryOptions<CookieByKeyResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: internalKeys.cookieByKey(key),
    queryFn: () => internalService.getCookieByKey(key),
    ...options,
  });
}
