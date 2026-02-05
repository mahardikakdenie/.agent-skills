export const TRANSACTION_ENDPOINTS = {
  transactions: "/v1/transactions",
  transactionDetail: (id: string) => `/v1/transactions/${id}`,
  transactionPayment: (id: string) => `/v1/transactions/payment/${id}`,
  transactionUpdateStatus: (id: string) =>
    `/v1/transactions/update-status/${id}`,
  transactionsBulkCreate: (id: string) =>
    `/v1/transactions/bulk-create/${id}`,
  transactionStatistics: "/v1/transactions/statistic-data",
  transactionsConventional: "/v1/transactions/conventional",
  customers: "/v1/customers",
  customersCampaign: "/v1/customers/campaign",
  campaignReport: (id: string) => `/v1/campaigns/report/${id}`,
} as const;
