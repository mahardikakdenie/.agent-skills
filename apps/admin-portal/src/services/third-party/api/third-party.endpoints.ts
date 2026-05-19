export const THIRD_PARTY_ENDPOINTS = {
  configurations: "/v1/configuration",
  configurationDetail: (id: string) => `/v1/configuration/${id}`,
  configurationByCode: (code: string) => `/v1/configuration/code/${code}`,
  channelMappings: "/v1/channel-mapping",
  channelMappingDetail: (id: string) => `/v1/channel-mapping/${id}`,
} as const;
