import type { AxiosRequestConfig } from "axios";

import { createApiClient } from "@/lib/api-client";
import qs from "qs";

import { CLAIM_ENDPOINTS } from "./claims.endpoints";
import type {
  ClaimFormsRequest,
  ListClaimRequest,
  UpdateClaimGrabRequest,
} from "./claims.types";

const claimApi = createApiClient(process.env.NEXT_PUBLIC_API_CLAIM_BASE_URL);

const withQuery = (url: string, params?: Record<string, unknown>) => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${qs.stringify(params, { arrayFormat: "brackets" })}`;
};

const toRecord = (params?: object) =>
  (params ? (params as unknown as Record<string, unknown>) : undefined);

type RequestConfig = Pick<AxiosRequestConfig, "signal">;

const get = async <T>(url: string, config?: RequestConfig) =>
  (await claimApi.get<T>(url, config)).data;
const post = async <T>(url: string, data?: unknown) =>
  (await claimApi.post<T>(url, data)).data;
const put = async <T>(url: string, data?: unknown) =>
  (await claimApi.put<T>(url, data)).data;

export const claimsService = {
  getClaims: (params?: ListClaimRequest, config?: RequestConfig) =>
    get(withQuery(CLAIM_ENDPOINTS.list, toRecord(params)), config),
  getClaimById: (id: string) => get(CLAIM_ENDPOINTS.detail(id)),
  updateClaim: (id: string, data: UpdateClaimGrabRequest | unknown) =>
    put(CLAIM_ENDPOINTS.detail(id), data),
  submitClaim: (id: string) => put(CLAIM_ENDPOINTS.submit(id), {}),
  updateClaimStatus: (id: string, payload: Record<string, unknown>) =>
    put(CLAIM_ENDPOINTS.updateStatus(id), payload),
  getConfigurations: () => get(CLAIM_ENDPOINTS.configurations),
  exportClaims: (params?: Record<string, unknown>) =>
    get(withQuery(CLAIM_ENDPOINTS.export, params)),
  importClaims: (payload: {
    data: string;
    input?: "File" | "Data";
    channel: string;
    category: string;
  }) =>
    post(CLAIM_ENDPOINTS.import, {
      ...payload,
      input: payload.input ?? "File",
    }),
  importClaimsAsJson: (payload: {
    data: unknown[];
    input?: "File" | "Data";
    channel: string;
    category: string;
  }) =>
    post(CLAIM_ENDPOINTS.import, {
      ...payload,
      input: payload.input ?? "Data",
    }),
  getImportDataGuide: (params?: ClaimFormsRequest) =>
    get(
      withQuery(
        CLAIM_ENDPOINTS.importDataGuide,
        toRecord(params)
      )
    ),
  getClaimListLimit: (params?: Record<string, unknown>) =>
    get(withQuery(CLAIM_ENDPOINTS.claimListLimit, params)),
  getClaimStatistics: (params?: Record<string, unknown>) =>
    get(withQuery(CLAIM_ENDPOINTS.statistics, params)),
  getClaimHistories: (params?: Record<string, unknown>) =>
    get(withQuery(CLAIM_ENDPOINTS.histories, params)),
  getClaimCategoryForms: (id: string, params?: ClaimFormsRequest) =>
    get(
      withQuery(
        CLAIM_ENDPOINTS.categoryForms(id),
        params as Record<string, unknown>
      )
    ),
  getClaimChannelForms: (id: string) =>
    get(CLAIM_ENDPOINTS.channelForms(id)),
};

