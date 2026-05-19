import { API_BASE_URLS, createApiClient } from "@/lib/api-client";
import qs from "qs";

import { CHANNEL_ENDPOINTS } from "./channel.endpoints";

const channelApi = createApiClient(API_BASE_URLS.channel);

const withQuery = (url: string, params?: Record<string, unknown>) => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${qs.stringify(params, { arrayFormat: "brackets" })}`;
};

const get = async <T>(url: string) => (await channelApi.get<T>(url)).data;
const post = async <T>(url: string, data?: unknown) =>
  (await channelApi.post<T>(url, data)).data;
const put = async <T>(url: string, data?: unknown) =>
  (await channelApi.put<T>(url, data)).data;
const del = async <T>(url: string) => (await channelApi.delete<T>(url)).data;

export const channelService = {
  getChannels: (params?: Record<string, unknown>) =>
    get(withQuery(CHANNEL_ENDPOINTS.channels, params)),
  getChannelById: (id: string) => get(CHANNEL_ENDPOINTS.channelDetail(id)),
  getChannelConfigurations: (params?: Record<string, unknown>) =>
    get(withQuery(CHANNEL_ENDPOINTS.channelConfigurations, params)),

  getChannelsV1: (params?: Record<string, unknown>) =>
    get(withQuery(CHANNEL_ENDPOINTS.channelsV1, params)),
  getChannelByIdV1: (id: string) => get(CHANNEL_ENDPOINTS.channelDetailV1(id)),
  createChannel: (payload: unknown) => post(CHANNEL_ENDPOINTS.channelsV1, payload),
  updateChannel: (id: string, payload: unknown) =>
    put(CHANNEL_ENDPOINTS.channelDetailV1(id), payload),
  deleteChannel: (id: string) => del(CHANNEL_ENDPOINTS.channelDetailV1(id)),
};

