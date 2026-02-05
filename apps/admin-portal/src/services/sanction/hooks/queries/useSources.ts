import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { sanctionService } from "../../api/sanction.service";
import { sanctionKeys } from "../../query-keys";

type SourcesResponse = Awaited<ReturnType<typeof sanctionService.getSources>>;
type SourcesParams = Parameters<typeof sanctionService.getSources>[0];

export function useSources(
  params?: SourcesParams,
  options?: Omit<UseQueryOptions<SourcesResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: sanctionKeys.sourceList(params as Record<string, unknown> | undefined),
    queryFn: () => sanctionService.getSources(params),
    ...options,
  });
}
