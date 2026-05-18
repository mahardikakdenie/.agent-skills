import { thirdPartyService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";

export interface ThirdPartyConfig {
  id: string;
  name: string;
  code: string;
  client_id?: string;
  client_secret?: string;
  access_token?: string;
  refresh_token?: string;
  updated_token_at?: string;
  session_id?: string;
  module?: string;
  configuration?: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ThirdPartyConfigPayload {
  name: string;
  code?: string;
  client_id?: string;
  client_secret?: string;
  access_token?: string;
  refresh_token?: string;
  session_id?: string;
  module?: string;
  configuration?: Record<string, unknown>;
  is_active?: boolean;
}

export interface ChannelMapping {
  id: string;
  channel: string;
  third_party_id: string;
  relation_id?: string;
  third_party?: {
    id: string;
    name: string;
    code: string;
    is_active: boolean;
  };
  relation?: unknown;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ChannelMappingPayload {
  channel: string;
  third_party_id: string;
  relation_id?: string;
}

export const CrmConfigService = {
  // Third Party Configuration
  getConfigurations: (params?: { search?: string; code?: string }) => {
    return thirdPartyService.get(ApiURL.v1Configuration, { params });
  },

  getConfigurationById: (id: string) => {
    return thirdPartyService.get(ApiURL.v1ConfigurationDetails(id));
  },

  getConfigurationByCode: (code: string) => {
    return thirdPartyService.get(ApiURL.v1ConfigurationByCode(code));
  },

  createConfiguration: (data: ThirdPartyConfigPayload) => {
    return thirdPartyService.post(ApiURL.v1Configuration, data);
  },

  updateConfiguration: (id: string, data: Partial<ThirdPartyConfigPayload>) => {
    return thirdPartyService.put(ApiURL.v1ConfigurationDetails(id), data);
  },

  deleteConfiguration: (id: string) => {
    return thirdPartyService.delete(ApiURL.v1ConfigurationDetails(id));
  },

  // Channel Mapping
  getChannelMappings: (params?: {
    search?: string;
    channel?: string;
    third_party_id?: string;
  }) => {
    return thirdPartyService.get(ApiURL.v1ChannelMapping, { params });
  },

  getChannelMappingById: (id: string) => {
    return thirdPartyService.get(ApiURL.v1ChannelMappingDetails(id));
  },

  createChannelMapping: (data: ChannelMappingPayload) => {
    return thirdPartyService.post(ApiURL.v1ChannelMapping, data);
  },

  updateChannelMapping: (id: string, data: Partial<ChannelMappingPayload>) => {
    return thirdPartyService.put(ApiURL.v1ChannelMappingDetails(id), data);
  },

  deleteChannelMapping: (id: string) => {
    return thirdPartyService.delete(ApiURL.v1ChannelMappingDetails(id));
  },
};
