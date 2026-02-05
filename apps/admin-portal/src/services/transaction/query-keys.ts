export const transactionKeys = {
  all: ["transaction"] as const,
  transactions: () => [...transactionKeys.all, "transactions"] as const,
  transactionList: (params?: Record<string, unknown>) =>
    [...transactionKeys.transactions(), "list", params] as const,
  transactionDetail: (id: string) =>
    [...transactionKeys.transactions(), "detail", id] as const,
  transactionStatistics: (params?: Record<string, unknown>) =>
    [...transactionKeys.transactions(), "statistics", params] as const,

  customers: () => [...transactionKeys.all, "customers"] as const,
  customerList: (params?: Record<string, unknown>) =>
    [...transactionKeys.customers(), "list", params] as const,
  customerCampaigns: (params?: Record<string, unknown>) =>
    [...transactionKeys.customers(), "campaigns", params] as const,

  campaignReports: () => [...transactionKeys.all, "campaign-reports"] as const,
  campaignReport: (id: string) =>
    [...transactionKeys.campaignReports(), "detail", id] as const,
};
