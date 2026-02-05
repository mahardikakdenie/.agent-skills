export const promotionKeys = {
  all: ["promotion"] as const,
  campaigns: () => [...promotionKeys.all, "campaigns"] as const,
  campaignList: (params?: Record<string, unknown>) =>
    [...promotionKeys.campaigns(), "list", params] as const,
  campaignDetail: (id: string) =>
    [...promotionKeys.campaigns(), "detail", id] as const,
  campaignSearch: (params?: Record<string, unknown>) =>
    [...promotionKeys.campaigns(), "search", params] as const,

  campaignReport: (params?: Record<string, unknown>) =>
    [...promotionKeys.campaigns(), "report", params] as const,
  campaignReportInsurance: (params?: Record<string, unknown>) =>
    [...promotionKeys.campaigns(), "report-insurance", params] as const,
  campaignReportExport: (params?: Record<string, unknown>) =>
    [...promotionKeys.campaigns(), "report-export", params] as const,
  campaignReportExportInsurance: (params?: Record<string, unknown>) =>
    [...promotionKeys.campaigns(), "report-export-insurance", params] as const,

  campaignHistory: (id: string) =>
    [...promotionKeys.campaigns(), "history", id] as const,

  voucherDetail: (id: string) =>
    [...promotionKeys.all, "voucher", "detail", id] as const,
  voucherByCode: (code: string) =>
    [...promotionKeys.all, "voucher", "code", code] as const,
};
