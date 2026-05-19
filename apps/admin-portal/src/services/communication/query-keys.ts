import type { ChannelProviderFilters } from "./api/communication.types";

export const communicationKeys = {
  all: ["communication"] as const,
  channelProviders: () =>
    [...communicationKeys.all, "channel-providers"] as const,
  channelProviderList: (filters?: ChannelProviderFilters) =>
    [...communicationKeys.channelProviders(), "list", filters] as const,
  channelProviderDetail: (id: string) =>
    [...communicationKeys.channelProviders(), "detail", id] as const,
  availableProviders: (filters?: ChannelProviderFilters) =>
    [...communicationKeys.channelProviders(), "available", filters] as const,
};
