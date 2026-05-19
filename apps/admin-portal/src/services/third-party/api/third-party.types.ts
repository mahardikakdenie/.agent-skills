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

export interface ThirdPartyConfigFilters {
  search?: string;
  code?: string;
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

export interface ChannelMappingFilters {
  search?: string;
  channel?: string;
  third_party_id?: string;
}
