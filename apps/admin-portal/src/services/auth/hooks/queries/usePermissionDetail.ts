import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type PermissionResponse = Awaited<
  ReturnType<typeof authService.getPermissionById>
>;

export function usePermissionDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<PermissionResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: authKeys.permissionDetail(id),
    queryFn: () => authService.getPermissionById(id),
    ...options,
  });
}
