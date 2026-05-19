export interface ChannelsResponse {
  data: any;
  id: string;
  name: string;
  type: string;
  total: number;
  pageTotal: number;
}

export interface Channel {
  data: any;
  id: string;
  name: string;
  type: string;
}

export interface ChannelListResponse {
  data: unknown;
  limit?: number;
  page?: number;
  pageTotal?: number;
  total?: number;
}
