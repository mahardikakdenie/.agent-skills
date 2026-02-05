import { createApiClient } from "@/lib/interceptor";
import qs from "qs";

import { TRANSACTION_ENDPOINTS } from "./transaction.endpoints";

const transactionApi = createApiClient(
  process.env.NEXT_PUBLIC_TRANSACTION_SERVICE_URL
);

const withQuery = (url: string, params?: Record<string, unknown>) => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${qs.stringify(params, { arrayFormat: "brackets" })}`;
};

const get = async <T>(url: string) => (await transactionApi.get<T>(url)).data;
const post = async <T>(url: string, data?: unknown) =>
  (await transactionApi.post<T>(url, data)).data;
const put = async <T>(url: string, data?: unknown) =>
  (await transactionApi.put<T>(url, data)).data;

export const transactionService = {
  getTransactions: (params?: Record<string, unknown>) =>
    get(withQuery(TRANSACTION_ENDPOINTS.transactions, params)),
  getTransactionById: (id: string) =>
    get(TRANSACTION_ENDPOINTS.transactionDetail(id)),
  updateTransactionPayment: (id: string, payload: unknown) =>
    put(TRANSACTION_ENDPOINTS.transactionPayment(id), payload),
  updateTransactionStatus: (id: string, payload: unknown) =>
    put(TRANSACTION_ENDPOINTS.transactionUpdateStatus(id), payload),
  bulkCreateTransactions: (id: string, payload: unknown) =>
    post(TRANSACTION_ENDPOINTS.transactionsBulkCreate(id), payload),
  getTransactionStatistics: (params?: Record<string, unknown>) =>
    get(withQuery(TRANSACTION_ENDPOINTS.transactionStatistics, params)),
  createTransactionsConventional: (payload: unknown) =>
    post(TRANSACTION_ENDPOINTS.transactionsConventional, payload),

  getCustomers: (params?: Record<string, unknown>) =>
    get(withQuery(TRANSACTION_ENDPOINTS.customers, params)),
  getCustomerCampaigns: (params?: Record<string, unknown>) =>
    get(withQuery(TRANSACTION_ENDPOINTS.customersCampaign, params)),

  getCampaignReport: (id: string) =>
    get(TRANSACTION_ENDPOINTS.campaignReport(id)),
  updateCampaignReport: (id: string, payload: unknown) =>
    put(TRANSACTION_ENDPOINTS.campaignReport(id), payload),
};
