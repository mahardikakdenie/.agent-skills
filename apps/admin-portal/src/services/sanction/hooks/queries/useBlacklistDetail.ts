import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { sanctionService } from "../../api/sanction.service";
import { sanctionKeys } from "../../query-keys";

type BlacklistDetailResponse = Awaited<
  ReturnType<typeof sanctionService.getBlacklistById>
>;

export function useBlacklistDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<BlacklistDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: sanctionKeys.blacklistDetail(id),
    queryFn: () => sanctionService.getBlacklistById(id),
    ...options,
  });
}
