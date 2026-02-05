import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { transactionService } from "../../api/transaction.service";
import { transactionKeys } from "../../query-keys";

type CustomersResponse = Awaited<
  ReturnType<typeof transactionService.getCustomers>
>;
type CustomersParams = Parameters<typeof transactionService.getCustomers>[0];

export function useCustomers(
  params?: CustomersParams,
  options?: Omit<UseQueryOptions<CustomersResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: transactionKeys.customerList(
      params as Record<string, unknown> | undefined
    ),
    queryFn: () => transactionService.getCustomers(params),
    ...options,
  });
}
