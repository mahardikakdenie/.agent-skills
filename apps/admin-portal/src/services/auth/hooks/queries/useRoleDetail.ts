import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type RoleResponse = Awaited<ReturnType<typeof authService.getRoleById>>;

export function useRoleDetail(
  id: string,
  options?: Omit<UseQueryOptions<RoleResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: authKeys.roleDetail(id),
    queryFn: () => authService.getRoleById(id),
    ...options,
  });
}
