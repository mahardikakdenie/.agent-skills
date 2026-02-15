import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { policyService } from "../../api/policy.service";
import { policyKeys } from "../../query-keys";

type PoliciesParams = Parameters<typeof policyService.getPolicies>[0];
type AllPoliciesResponse = Awaited<ReturnType<typeof policyService.getPolicies>>;

export function useAllPolicies(
  params?: PoliciesParams,
  options?: Omit<
    UseQueryOptions<AllPoliciesResponse[], Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: policyKeys.policyAllList(params as Record<string, unknown> | undefined),
    queryFn: async () => {
      const allData: AllPoliciesResponse[] = [];
      let currentPage = 1;
      let totalRecords = 0;

      do {
        const response: any = await policyService.getPolicies({
          ...(params || {}),
          page: currentPage,
          limit: 100,
        });

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

