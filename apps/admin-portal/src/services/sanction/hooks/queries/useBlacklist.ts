import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { sanctionService } from "../../api/sanction.service";
import { sanctionKeys } from "../../query-keys";

type BlacklistResponse = Awaited<
  ReturnType<typeof sanctionService.getBlacklist>
>;
type BlacklistParams = Parameters<typeof sanctionService.getBlacklist>[0];

export function useBlacklist(
  params?: BlacklistParams,
  options?: Omit<
    UseQueryOptions<BlacklistResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: sanctionKeys.blacklistList(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => sanctionService.getBlacklist(params),
    ...options,
  });
}
