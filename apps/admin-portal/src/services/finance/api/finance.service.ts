import { createApiClient } from "@/lib/api-client";
import qs from "qs";

import { FINANCE_ENDPOINTS } from "./finance.endpoints";

const financeApi = createApiClient(process.env.NEXT_PUBLIC_FINANCE_SERVICE_URL);

const withQuery = (url: string, params?: Record<string, unknown>) => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${qs.stringify(params, { arrayFormat: "brackets" })}`;
};

const get = async <T>(url: string) => (await financeApi.get<T>(url)).data;
const post = async <T>(
  url: string,
  data?: unknown,
  config?: Record<string, unknown>
) => (await financeApi.post<T>(url, data, config)).data;
const put = async <T>(url: string, data?: unknown) =>
  (await financeApi.put<T>(url, data)).data;
const del = async <T>(url: string) => (await financeApi.delete<T>(url)).data;

export const financeService = {
  getBillings: (params?: Record<string, unknown>) =>
    get(withQuery(FINANCE_ENDPOINTS.billings, params)),
  getBillingById: (id: string, params?: Record<string, unknown>) =>
    get(withQuery(FINANCE_ENDPOINTS.billings, { id, ...params })),
  createBilling: (payload: unknown) => post(FINANCE_ENDPOINTS.billings, payload),
  updateBilling: (id: string, payload: unknown) =>
    put(FINANCE_ENDPOINTS.billingDetail(id), payload),
  confirmBillingReconciliation: (id: string) =>
    post(FINANCE_ENDPOINTS.billingConfirmReconciliation(id), {}),
  getNotMatchReconciliation: (params?: Record<string, unknown>) =>
    get(withQuery(FINANCE_ENDPOINTS.billingNotMatchReconciliation, params)),
  importTransactions: (formData: FormData) =>
    post(FINANCE_ENDPOINTS.billingImportTransactions, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getBrokerFees: (params?: Record<string, unknown>) =>
    get(withQuery(FINANCE_ENDPOINTS.feesBroker, params)),
  getBrokerFeesFilter: (params?: Record<string, unknown>) =>
    get(withQuery(FINANCE_ENDPOINTS.feesBrokerFilter, params)),
  getBrokerFeeById: (id: string) =>
    get(withQuery(FINANCE_ENDPOINTS.feesBroker, { id })),
  createBrokerFee: (payload: unknown) =>
    post(FINANCE_ENDPOINTS.feesBroker, payload),
  updateBrokerFee: (id: string, payload: unknown) =>
    put(FINANCE_ENDPOINTS.feesBrokerDetail(id), payload),
  deleteBrokerFee: (id: string) => del(FINANCE_ENDPOINTS.feesBrokerDetail(id)),

  getChannelFees: (params?: Record<string, unknown>) =>
    get(withQuery(FINANCE_ENDPOINTS.feesChannel, params)),
  getChannelFeesFilter: (params?: Record<string, unknown>) =>
    get(withQuery(FINANCE_ENDPOINTS.feesChannelFilter, params)),
  getChannelFeeById: (id: string) =>
    get(withQuery(FINANCE_ENDPOINTS.feesChannel, { id })),
  createChannelFee: (channelId: string, payload: unknown) =>
    post(FINANCE_ENDPOINTS.feesChannelByChannel(channelId), payload),
  updateChannelFee: (channelId: string, payload: unknown) =>
    put(FINANCE_ENDPOINTS.feesChannelByChannel(channelId), payload),
  deleteChannelFee: (id: string) => del(FINANCE_ENDPOINTS.feesChannelDetail(id)),

  getVoucherByCode: (code: string) => get(FINANCE_ENDPOINTS.voucherByCode(code)),
  createVoucherPlan: (payload: unknown) =>
    post(FINANCE_ENDPOINTS.voucherPlan, payload),
};

