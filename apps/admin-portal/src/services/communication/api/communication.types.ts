export interface ChannelProvider {
  id: string;
  channelId: string;
  type: string;
  provider: string;
  fromEmail?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelProviderPayload {
  channelId: string;
  type: string;
  provider: string;
  fromEmail?: string;
  enabled?: boolean;
}

export interface ChannelProviderFilters {
  type?: string;
}
