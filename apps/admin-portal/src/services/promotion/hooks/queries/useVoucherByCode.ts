import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type VoucherByCodeResponse = Awaited<
  ReturnType<typeof promotionService.getVoucherByCode>
>;

export function useVoucherByCode(
  code: string,
  options?: Omit<
    UseQueryOptions<VoucherByCodeResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: promotionKeys.voucherByCode(code),
    queryFn: () => promotionService.getVoucherByCode(code),
    ...options,
  });
}
