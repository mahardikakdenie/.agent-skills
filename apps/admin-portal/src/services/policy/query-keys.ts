export const policyKeys = {
  all: ["policy"] as const,
  policies: () => [...policyKeys.all, "policies"] as const,
  policyList: (params?: Record<string, unknown>) =>
    [...policyKeys.policies(), "list", params] as const,
  policyAllList: (params?: Record<string, unknown>) =>
    [...policyKeys.policies(), "all", params] as const,
  policyDetail: (id: string) =>
    [...policyKeys.policies(), "detail", id] as const,
  policyStatistics: (params?: Record<string, unknown>) =>
    [...policyKeys.policies(), "statistics", params] as const,
  masterPolicies: (channelId: string) =>
    [...policyKeys.policies(), "master", channelId] as const,

  endorsements: () => [...policyKeys.all, "endorsements"] as const,
  endorsementList: (params?: Record<string, unknown>) =>
    [...policyKeys.endorsements(), "list", params] as const,
  endorsementDetail: (id: string) =>
    [...policyKeys.endorsements(), "detail", id] as const,

  insuredParties: () => [...policyKeys.all, "insured-parties"] as const,
  insuredPartyList: (params?: Record<string, unknown>) =>
    [...policyKeys.insuredParties(), "list", params] as const,
  insuredPartyDetail: (id: string) =>
    [...policyKeys.insuredParties(), "detail", id] as const,
  insuredPartyStatistics: (params?: Record<string, unknown>) =>
    [...policyKeys.insuredParties(), "statistics", params] as const,
};
