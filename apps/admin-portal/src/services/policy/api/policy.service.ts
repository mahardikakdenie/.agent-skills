import { createApiClient } from "@/lib/api-client";
import qs from "qs";

import { POLICY_ENDPOINTS } from "./policy.endpoints";

const policyApi = createApiClient(process.env.NEXT_PUBLIC_API_POLICY_BASE_URL);

const withQuery = (url: string, params?: Record<string, unknown>) => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${qs.stringify(params, { arrayFormat: "brackets" })}`;
};

const get = async <T>(url: string) => (await policyApi.get<T>(url)).data;
const post = async <T>(
  url: string,
  data?: unknown,
  config?: Record<string, unknown>
) => (await policyApi.post<T>(url, data, config)).data;
const put = async <T>(url: string, data?: unknown) =>
  (await policyApi.put<T>(url, data)).data;

export const policyService = {
  getPolicies: (params?: Record<string, unknown>) =>
    get(withQuery(POLICY_ENDPOINTS.policies, params)),
  getPolicyById: (id: string) => get(POLICY_ENDPOINTS.policyDetail(id)),
  getPolicyStatistics: (params?: Record<string, unknown>) =>
    get(withQuery(POLICY_ENDPOINTS.policyStatistics, params)),
  getPolicyStatisticsYearly: (params?: Record<string, unknown>) =>
    get(withQuery(POLICY_ENDPOINTS.policyStatisticsYearly, params)),
  uploadPoliciesDrGadget: (formData: FormData) =>
    post(POLICY_ENDPOINTS.policyUploadDrGadget, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  renewPolicy: (id: string) => put(POLICY_ENDPOINTS.policyRenew(id), {}),

  getEndorsements: (params?: Record<string, unknown>) =>
    get(withQuery(POLICY_ENDPOINTS.endorsements, params)),
  getEndorsementById: (id: string) =>
    get(POLICY_ENDPOINTS.endorsementDetail(id)),
  updateEndorsementStatus: (id: string, payload: unknown) =>
    put(POLICY_ENDPOINTS.endorsementUpdateStatus(id), payload),
  updateEndorsementStatusBulking: (id: string, payload: unknown) =>
    put(POLICY_ENDPOINTS.endorsementUpdateStatusBulking(id), payload),
  bulkCreateEndorsements: (payload: unknown) =>
    post(POLICY_ENDPOINTS.endorsementBulking, payload),

  getMasterPoliciesByChannel: (channelId: string) =>
    get(
      `${POLICY_ENDPOINTS.masterPoliciesByChannel(
        channelId
      )}?is_only_master_policy=true`
    ),

  getInsuredParties: (params?: Record<string, unknown>) =>
    get(withQuery(POLICY_ENDPOINTS.insuredParties, params)),
  getInsuredPartyById: (id: string) =>
    get(POLICY_ENDPOINTS.insuredPartyDetail(id)),
  getInsuredPartyStatistics: (params?: Record<string, unknown>) =>
    get(withQuery(POLICY_ENDPOINTS.insuredPartyStatistics, params)),
  updateInsuredPartyChannel: (channelId: string, payload: unknown) =>
    put(POLICY_ENDPOINTS.insuredPartyChannel(channelId), payload),
  uploadInsuredPartiesFirstTime: (payload: unknown) =>
    post(POLICY_ENDPOINTS.insuredPartyUploadFirstTime, payload),
  uploadInsuredPartiesFirstTimeWithoutTransaction: (payload: unknown) =>
    post(POLICY_ENDPOINTS.insuredPartyUploadFirstTimeWithoutTransaction, payload),
};

