import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type RolesResponse = Awaited<ReturnType<typeof authService.getRoles>>;

export function useRoles(
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<RolesResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: authKeys.roleList(params),
    queryFn: () => authService.getRoles(params),
    ...options,
  });
}
