import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { sanctionService } from "../../api/sanction.service";
import { sanctionKeys } from "../../query-keys";

type SourceDetailResponse = Awaited<
  ReturnType<typeof sanctionService.getSourceById>
>;

export function useSourceDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<SourceDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: sanctionKeys.sourceDetail(id),
    queryFn: () => sanctionService.getSourceById(id),
    ...options,
  });
}
