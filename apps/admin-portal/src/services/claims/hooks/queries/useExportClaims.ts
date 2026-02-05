import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { claimsService } from "../../api/claims.service";
import { claimKeys } from "../../query-keys";

type ExportClaimsResponse = Awaited<
  ReturnType<typeof claimsService.exportClaims>
>;
type ExportClaimsParams = Parameters<typeof claimsService.exportClaims>[0];

export function useExportClaims(
  params?: ExportClaimsParams,
  options?: Omit<
    UseQueryOptions<ExportClaimsResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: claimKeys.export(params as Record<string, unknown> | undefined),
    queryFn: () => claimsService.exportClaims(params),
    ...options,
  });
}
