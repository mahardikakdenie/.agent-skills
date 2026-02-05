import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { promotionService } from "../../api/promotion.service";
import { promotionKeys } from "../../query-keys";

type VoucherDetailResponse = Awaited<
  ReturnType<typeof promotionService.getVoucherById>
>;

export function useVoucherDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<VoucherDetailResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: promotionKeys.voucherDetail(id),
    queryFn: () => promotionService.getVoucherById(id),
    ...options,
  });
}
