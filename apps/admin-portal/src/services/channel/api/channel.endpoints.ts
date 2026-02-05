export const CHANNEL_ENDPOINTS = {
  channels: "/channels",
  channelDetail: (id: string) => `/channels/${id}`,
  channelsV1: "/v1/channels",
  channelDetailV1: (id: string) => `/v1/channels/${id}`,
} as const;
