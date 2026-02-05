export type { ChannelsResponse } from "@/services/masterdata/channels.service";
export type { Channel } from "@/services/masterdata/user.service";

export interface ChannelListResponse {
  data: unknown;
  limit?: number;
  page?: number;
  pageTotal?: number;
  total?: number;
}
