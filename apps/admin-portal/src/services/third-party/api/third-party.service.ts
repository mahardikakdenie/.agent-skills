import { API_BASE_URLS, createApiClient } from "@/lib/api-client";

import { THIRD_PARTY_ENDPOINTS } from "./third-party.endpoints";
import type {
  ChannelMappingFilters,
  ChannelMappingPayload,
  ThirdPartyConfigFilters,
  ThirdPartyConfigPayload,
} from "./third-party.types";

const thirdPartyApi = createApiClient(API_BASE_URLS.thirdParty);

export const thirdPartyService = {
  getConfigurations: (filters?: ThirdPartyConfigFilters) =>
    thirdPartyApi.get(THIRD_PARTY_ENDPOINTS.configurations, {
      params: filters,
    }),
  getConfigurationById: (id: string) =>
    thirdPartyApi.get(THIRD_PARTY_ENDPOINTS.configurationDetail(id)),
  getConfigurationByCode: (code: string) =>
    thirdPartyApi.get(THIRD_PARTY_ENDPOINTS.configurationByCode(code)),
  createConfiguration: (payload: ThirdPartyConfigPayload) =>
    thirdPartyApi.post(THIRD_PARTY_ENDPOINTS.configurations, payload),
  updateConfiguration: (
    id: string,
    payload: Partial<ThirdPartyConfigPayload>
  ) => thirdPartyApi.put(THIRD_PARTY_ENDPOINTS.configurationDetail(id), payload),
  deleteConfiguration: (id: string) =>
    thirdPartyApi.delete(THIRD_PARTY_ENDPOINTS.configurationDetail(id)),

  getChannelMappings: (filters?: ChannelMappingFilters) =>
    thirdPartyApi.get(THIRD_PARTY_ENDPOINTS.channelMappings, {
      params: filters,
    }),
  getChannelMappingById: (id: string) =>
    thirdPartyApi.get(THIRD_PARTY_ENDPOINTS.channelMappingDetail(id)),
  createChannelMapping: (payload: ChannelMappingPayload) =>
    thirdPartyApi.post(THIRD_PARTY_ENDPOINTS.channelMappings, payload),
  updateChannelMapping: (
    id: string,
    payload: Partial<ChannelMappingPayload>
  ) => thirdPartyApi.put(THIRD_PARTY_ENDPOINTS.channelMappingDetail(id), payload),
  deleteChannelMapping: (id: string) =>
    thirdPartyApi.delete(THIRD_PARTY_ENDPOINTS.channelMappingDetail(id)),
};
