import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type ChannelPackagesResponse = Awaited<
  ReturnType<typeof productService.getChannelPackagesByChannel>
>;

export function useChannelPackages(
  channel: string,
  options?: Omit<
    UseQueryOptions<ChannelPackagesResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: productKeys.channelPackages(channel),
    queryFn: () => productService.getChannelPackagesByChannel(channel),
    ...options,
  });
}
