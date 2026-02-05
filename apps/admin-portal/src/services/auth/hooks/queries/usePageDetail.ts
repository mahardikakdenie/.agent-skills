import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type PageResponse = Awaited<ReturnType<typeof authService.getPageById>>;

export function usePageDetail(
  id: string,
  options?: Omit<UseQueryOptions<PageResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: authKeys.pageDetail(id),
    queryFn: () => authService.getPageById(id),
    ...options,
  });
}
