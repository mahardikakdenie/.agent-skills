import { useState } from "react";
import ApiURL from "@/constants/api-url.const";
import { channelService } from "@/services/api.service";

export const useChannels = () => {
  const [channels, setChannels] = useState<any[]>([]);

  const fetchChannels = async (search: any) => {
    const { data } = await channelService.get(ApiURL.v1Channels, { params: { page: 1, limit: 100 } });
    setChannels(data);
  };

  const fetchChannelsById = async (id: string) => {
    const response: any = await channelService.get(ApiURL.v1ChannelDetails(id));
    return response.data;
  };

  const saveChannels = async (data: any) => {
    const { data: response } = await channelService.post(ApiURL.v1Channels, data);
    return response;
  };

  const updateChannels = async (data: any, id: string) => {
    const { data: response } = await channelService.put(ApiURL.v1ChannelDetails(id), data);
    return response;
  };

  const deleteChannels = async (id: string) => {
    const { data: response } = await channelService.delete(ApiURL.v1ChannelDetails(id));
    return response;
  };

  return {
    channels,
    saveChannels,
    updateChannels,
    deleteChannels,
    fetchChannels,
    fetchChannelsById,
  };
};
