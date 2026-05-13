import { communicationService, channelService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";

export const CommunicationService = {
  getChannelProviders: (type?: string) => {
    const params = type ? { type } : {};
    return communicationService.get(ApiURL.channelProviders, { params });
  },

  getChannelProvider: (channelId: string) => {
    return communicationService.get(ApiURL.channelProviderDetails(channelId));
  },

  createChannelProvider: (data: {
    channelId: string;
    type: string;
    provider: string;
    fromEmail?: string;
    enabled?: boolean;
  }) => {
    return communicationService.post(ApiURL.channelProviders, data);
  },

  updateChannelProvider: (
    channelId: string,
    data: { channelId?: string; type?: string; provider?: string; fromEmail?: string; enabled?: boolean }
  ) => {
    return communicationService.patch(
      ApiURL.channelProviderDetails(channelId),
      data
    );
  },

  getAvailableProviders: (type?: string) => {
    const params = type ? { type } : {};
    return communicationService.get(ApiURL.channelProviderAvailableProviders, {
      params,
    });
  },

  getChannels: () => {
    return channelService.get(ApiURL.channels);
  },

  deleteChannelProvider: (id: string) => {
    return communicationService.delete(ApiURL.channelProviderDetails(id));
  },
};
