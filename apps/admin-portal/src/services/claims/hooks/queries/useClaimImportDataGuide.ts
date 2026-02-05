import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ImportDataGuideResponse = Awaited<
  ReturnType<typeof claimsService.getImportDataGuide>
>;
type ImportDataGuideParams = Parameters<
  typeof claimsService.getImportDataGuide
>[0];

export function useClaimImportDataGuide(
  params?: ImportDataGuideParams,
  options?: Omit<
    UseQueryOptions<ImportDataGuideResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: claimKeys.importDataGuide(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => claimsService.getImportDataGuide(params),
    ...options,
  });
}
