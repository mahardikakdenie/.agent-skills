export const CHANNEL_ENDPOINTS = {
  channels: "/channels",
  channelDetail: (id: string) => `/channels/${id}`,
  channelConfigurations: "/channel-configurations",
  channelsV1: "/v1/channels",
  channelDetailV1: (id: string) => `/v1/channels/${id}`,
} as const;
