import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";
import { authKeys } from "../../query-keys";

type GroupResponse = Awaited<ReturnType<typeof authService.getGroupById>>;

export function useGroupDetail(
  id: string,
  options?: Omit<UseQueryOptions<GroupResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: authKeys.groupDetail(id),
    queryFn: () => authService.getGroupById(id),
    ...options,
  });
}
