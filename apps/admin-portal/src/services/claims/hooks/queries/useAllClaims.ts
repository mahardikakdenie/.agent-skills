import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ClaimsParams = Parameters<typeof claimsService.getClaims>[0];
type AllClaimsResponse = Awaited<ReturnType<typeof claimsService.getClaims>>;

export function useAllClaims(
  params?: ClaimsParams,
  options?: Omit<
    UseQueryOptions<AllClaimsResponse[], Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: claimKeys.allList(
      params as unknown as Record<string, unknown> | undefined
    ),
    queryFn: async () => {
      const allData: AllClaimsResponse[] = [];
      let currentPage = 1;
      let totalRecords = 0;

      do {
        const response: any = await claimsService.getClaims({
          ...(params || {}),
          page: currentPage,
          limit: 100,
        } as any);

        if (response?.data) {
          allData.push(...response.data);
          totalRecords = response.total || 0;
        } else {
          totalRecords = 0;
        }

        currentPage += 1;
      } while (allData.length < totalRecords && totalRecords > 0);

      return allData;
    },
    ...options,
  });
}

