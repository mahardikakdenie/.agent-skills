export const channelKeys = {
  all: ["channel"] as const,
  channels: () => [...channelKeys.all, "channels"] as const,
  channelList: (params?: Record<string, unknown>) =>
    [...channelKeys.channels(), "list", params] as const,
  channelDetail: (id: string) =>
    [...channelKeys.channels(), "detail", id] as const,

  channelsV1: () => [...channelKeys.all, "channels-v1"] as const,
  channelListV1: (params?: Record<string, unknown>) =>
    [...channelKeys.channelsV1(), "list", params] as const,
  channelDetailV1: (id: string) =>
    [...channelKeys.channelsV1(), "detail", id] as const,
};
