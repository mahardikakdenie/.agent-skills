import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type PermissionsResponse = Awaited<
  ReturnType<typeof authService.getPermissions>
>;

export function usePermissions(
  params?: Record<string, unknown>,
  options?: Omit<
    UseQueryOptions<PermissionsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: authKeys.permissionList(params),
    queryFn: () => authService.getPermissions(params),
    ...options,
  });
}
