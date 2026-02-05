export const financeKeys = {
  all: ["finance"] as const,
  billings: () => [...financeKeys.all, "billings"] as const,
  billingList: (params?: Record<string, unknown>) =>
    [...financeKeys.billings(), "list", params] as const,
  billingDetail: (id: string, params?: Record<string, unknown>) =>
    [...financeKeys.billings(), "detail", id, params] as const,
  billingNotMatch: (params?: Record<string, unknown>) =>
    [...financeKeys.billings(), "not-match", params] as const,

  brokerFees: () => [...financeKeys.all, "broker-fees"] as const,
  brokerFeeList: (params?: Record<string, unknown>) =>
    [...financeKeys.brokerFees(), "list", params] as const,
  brokerFeesFilter: (params?: Record<string, unknown>) =>
    [...financeKeys.brokerFees(), "filter", params] as const,
  brokerFeeDetail: (id: string) =>
    [...financeKeys.brokerFees(), "detail", id] as const,

  channelFees: () => [...financeKeys.all, "channel-fees"] as const,
  channelFeeList: (params?: Record<string, unknown>) =>
    [...financeKeys.channelFees(), "list", params] as const,
  channelFeesFilter: (params?: Record<string, unknown>) =>
    [...financeKeys.channelFees(), "filter", params] as const,
  channelFeeDetail: (id: string) =>
    [...financeKeys.channelFees(), "detail", id] as const,

  voucherByCode: (code: string) =>
    [...financeKeys.all, "voucher", "code", code] as const,
};
