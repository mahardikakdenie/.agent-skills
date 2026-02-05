import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { financeService } from "../../api/finance.service";
import { financeKeys } from "../../query-keys";

type VoucherByCodeResponse = Awaited<
  ReturnType<typeof financeService.getVoucherByCode>
>;

export function useVoucherByCode(
  code: string,
  options?: Omit<
    UseQueryOptions<VoucherByCodeResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: financeKeys.voucherByCode(code),
    queryFn: () => financeService.getVoucherByCode(code),
    ...options,
  });
}
