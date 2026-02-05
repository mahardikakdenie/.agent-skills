import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type PermissionByPageResponse = Awaited<
  ReturnType<typeof authService.getPermissionsByPage>
>;

export function usePermissionByPage(
  pageId: string,
  params?: Record<string, unknown>,
  options?: Omit<
    UseQueryOptions<PermissionByPageResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: authKeys.permissionByPage(pageId, params),
    queryFn: () => authService.getPermissionsByPage(pageId, params),
    ...options,
  });
}
