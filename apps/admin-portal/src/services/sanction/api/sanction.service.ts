import { createApiClient } from "@/lib/interceptor";
import qs from "qs";

import { SANCTION_ENDPOINTS } from "./sanction.endpoints";

const sanctionApi = createApiClient(process.env.NEXT_PUBLIC_SANCTION_SERVICE_URL);

const withQuery = (url: string, params?: Record<string, unknown>) => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${qs.stringify(params, { arrayFormat: "brackets" })}`;
};

const get = async <T>(url: string) => (await sanctionApi.get<T>(url)).data;
const post = async <T>(url: string, data?: unknown) =>
  (await sanctionApi.post<T>(url, data)).data;
const put = async <T>(url: string, data?: unknown) =>
  (await sanctionApi.put<T>(url, data)).data;
const del = async <T>(url: string) => (await sanctionApi.delete<T>(url)).data;

export const sanctionService = {
  getSources: (params?: Record<string, unknown>) =>
    get(withQuery(SANCTION_ENDPOINTS.sourcesPaging, params)),
  getSourceById: (id: string) => get(SANCTION_ENDPOINTS.sourceDetail(id)),
  createSource: (payload: unknown) => post(SANCTION_ENDPOINTS.sources, payload),
  updateSource: (id: string, payload: unknown) =>
    put(SANCTION_ENDPOINTS.sourceUpdate(id), payload),
  deleteSource: (id: string) => del(SANCTION_ENDPOINTS.sourceDelete(id)),

  getBlacklist: (params?: Record<string, unknown>) =>
    get(withQuery(SANCTION_ENDPOINTS.blacklist, params)),
  getBlacklistById: (id: string) => get(SANCTION_ENDPOINTS.blacklistDetail(id)),
  createBlacklist: (payload: unknown) => post(SANCTION_ENDPOINTS.blacklist, payload),
  updateBlacklist: (id: string, payload: unknown) =>
    put(SANCTION_ENDPOINTS.blacklistUpdate(id), payload),
  deleteBlacklist: (id: string) => del(SANCTION_ENDPOINTS.blacklistDelete(id)),
};
