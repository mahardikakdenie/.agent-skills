import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type PagesResponse = Awaited<ReturnType<typeof authService.getPages>>;

export function usePages(
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<PagesResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: authKeys.pageList(params),
    queryFn: () => authService.getPages(params),
    ...options,
  });
}
