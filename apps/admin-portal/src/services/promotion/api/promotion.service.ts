import { createApiClient } from "@/lib/api-client";
import qs from "qs";

import { PROMOTION_ENDPOINTS } from "./promotion.endpoints";

const promotionApi = createApiClient(process.env.NEXT_PUBLIC_PROMOTION_SERVICE_URL);

const withQuery = (url: string, params?: Record<string, unknown>) => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${qs.stringify(params, { arrayFormat: "brackets" })}`;
};

const get = async <T>(url: string) => (await promotionApi.get<T>(url)).data;
const post = async <T>(url: string, data?: unknown) =>
  (await promotionApi.post<T>(url, data)).data;
const put = async <T>(url: string, data?: unknown) =>
  (await promotionApi.put<T>(url, data)).data;
const del = async <T>(url: string) => (await promotionApi.delete<T>(url)).data;

export const promotionService = {
  getCampaigns: (params?: Record<string, unknown>) =>
    get(withQuery(PROMOTION_ENDPOINTS.campaigns, params)),
  getCampaignById: (id: string) => get(withQuery(PROMOTION_ENDPOINTS.campaignDetail(id), { id })),
  searchCampaigns: (params?: Record<string, unknown>) =>
    get(withQuery(PROMOTION_ENDPOINTS.campaignSearch, params)),

  getCampaignReport: (params?: Record<string, unknown>) =>
    get(withQuery(PROMOTION_ENDPOINTS.campaignReport, params)),
  getCampaignReportInsurance: (params?: Record<string, unknown>) =>
    get(withQuery(PROMOTION_ENDPOINTS.campaignReportInsurance, params)),
  exportCampaignReport: (params?: Record<string, unknown>) =>
    get(withQuery(PROMOTION_ENDPOINTS.campaignReportExport, params)),
  exportCampaignReportInsurance: (params?: Record<string, unknown>) =>
    get(withQuery(PROMOTION_ENDPOINTS.campaignReportExportInsurance, params)),

  getCampaignHistory: (id: string) => get(withQuery(PROMOTION_ENDPOINTS.campaignHistory(id), { id })),
  createCampaign: (payload: unknown) => post(PROMOTION_ENDPOINTS.campaigns, payload),
  updateCampaign: (id: string, payload: unknown) =>
    put(PROMOTION_ENDPOINTS.campaignUpdate(id), payload),
  deleteCampaign: (id: string) => del(PROMOTION_ENDPOINTS.campaignDelete(id)),

  getVoucherById: (id: string) => get(PROMOTION_ENDPOINTS.voucherDetail(id)),
  getVoucherByCode: (code: string) => get(PROMOTION_ENDPOINTS.voucherByCode(code)),
  createVoucherPlan: (payload: unknown) => post(PROMOTION_ENDPOINTS.voucherPlan, payload),
};

