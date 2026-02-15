export const POLICY_ENDPOINTS = {
  policies: "/v1/policies",
  policyDetail: (id: string) => `/v1/policies/${id}`,
  policyStatistics: "/v1/policies/statistic-data",
  policyStatisticsYearly: "/policies/statistic-yearly",
  policyUploadDrGadget: "/v1/policies/upload/drgadget",
  policyRenew: (id: string) => `/v1/policies/${id}/renew`,
  endorsements: "/v1/endorsements",
  endorsementDetail: (id: string) => `/v1/endorsements/${id}`,
  endorsementUpdateStatus: (id: string) =>
    `/v1/endorsements/update-status/${id}`,
  endorsementUpdateStatusBulking: (id: string) =>
    `/v1/endorsements/update-status-bulking/${id}`,
  endorsementBulking: "/v1/endorsements/bulking",
  masterPoliciesByChannel: (channelId: string) =>
    `/v1/policies/master/${channelId}`,
  insuredParties: "/v1/insured-parties",
  insuredPartyDetail: (id: string) => `/v1/insured-parties/${id}`,
  insuredPartyStatistics: "/v1/insured-parties/statistic-data",
  insuredPartyChannel: (channelId: string) =>
    `/v1/insured-parties/channel/${channelId}`,
  insuredPartyUploadFirstTime: "/v1/insured-parties/upload-first-time",
  insuredPartyUploadFirstTimeWithoutTransaction:
    "/v1/insured-parties/upload-first-time-without-transaction",
} as const;
