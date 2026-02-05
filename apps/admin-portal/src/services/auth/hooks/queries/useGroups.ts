import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type GroupsResponse = Awaited<ReturnType<typeof authService.getGroups>>;

export function useGroups(
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<GroupsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: authKeys.groupList(params),
    queryFn: () => authService.getGroups(params),
    ...options,
  });
}
