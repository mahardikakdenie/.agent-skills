import type {
  ChannelMappingFilters,
  ThirdPartyConfigFilters,
} from "./api/third-party.types";

export const thirdPartyKeys = {
  all: ["third-party"] as const,
  configurations: () => [...thirdPartyKeys.all, "configurations"] as const,
  configurationList: (filters?: ThirdPartyConfigFilters) =>
    [...thirdPartyKeys.configurations(), "list", filters] as const,
  configurationDetail: (id: string) =>
    [...thirdPartyKeys.configurations(), "detail", id] as const,
  configurationByCode: (code: string) =>
    [...thirdPartyKeys.configurations(), "code", code] as const,

  channelMappings: () => [...thirdPartyKeys.all, "channel-mappings"] as const,
  channelMappingList: (filters?: ChannelMappingFilters) =>
    [...thirdPartyKeys.channelMappings(), "list", filters] as const,
  channelMappingDetail: (id: string) =>
    [...thirdPartyKeys.channelMappings(), "detail", id] as const,
};
