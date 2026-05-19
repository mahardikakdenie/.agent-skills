import { API_BASE_URLS, createApiClient } from "@/lib/api-client";

import { COMMUNICATION_ENDPOINTS } from "./communication.endpoints";
import type {
  ChannelProviderFilters,
  ChannelProviderPayload,
} from "./communication.types";

const communicationApi = createApiClient({
  baseURL: API_BASE_URLS.communication,
  withAuth: false,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
  },
});

export const communicationApiService = {
  getChannelProviders: (filters?: ChannelProviderFilters) =>
    communicationApi.get(COMMUNICATION_ENDPOINTS.channelProviders, {
      params: filters,
    }),
  getChannelProvider: (id: string) =>
    communicationApi.get(COMMUNICATION_ENDPOINTS.channelProviderDetail(id)),
  createChannelProvider: (payload: ChannelProviderPayload) =>
    communicationApi.post(COMMUNICATION_ENDPOINTS.channelProviders, payload),
  updateChannelProvider: (
    id: string,
    payload: Partial<ChannelProviderPayload>
  ) =>
    communicationApi.patch(
      COMMUNICATION_ENDPOINTS.channelProviderDetail(id),
      payload
    ),
  deleteChannelProvider: (id: string) =>
    communicationApi.delete(COMMUNICATION_ENDPOINTS.channelProviderDetail(id)),
  getAvailableProviders: (filters?: ChannelProviderFilters) =>
    communicationApi.get(COMMUNICATION_ENDPOINTS.availableProviders, {
      params: filters,
    }),
};
