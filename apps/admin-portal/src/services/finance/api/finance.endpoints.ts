export const FINANCE_ENDPOINTS = {
  billings: "/v1/billings",
  billingDetail: (id: string) => `/v1/billings/${id}`,
  billingConfirmReconciliation: (id: string) =>
    `/v1/billings/${id}/confirm-reconcilliation`,
  billingNotMatchReconciliation: "/v1/billings/not-match-reconcilliation",
  billingImportTransactions: "/v1/billings/import/transactions",
  feesBroker: "/v1/fees/broker",
  feesBrokerFilter: "/v1/fees/broker-filter",
  feesBrokerDetail: (id: string) => `/v1/fees/broker/${id}`,
  feesChannel: "/v1/fees/channel",
  feesChannelFilter: "/v1/fees/channel-filter",
  feesChannelDetail: (id: string) => `/v1/fees/channel/${id}`,
  feesChannelByChannel: (channelId: string) => `/v1/fees/channel/${channelId}`,
  voucherByCode: (code: string) => `/api/voucher/code/${code}`,
  voucherPlan: "/v1/plans/",
} as const;
