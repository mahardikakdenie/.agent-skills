export const COMMUNICATION_ENDPOINTS = {
  channelProviders: "/channel-providers",
  channelProviderDetail: (id: string) => `/channel-providers/${id}`,
  availableProviders: "/channel-providers/available-providers",
} as const;
