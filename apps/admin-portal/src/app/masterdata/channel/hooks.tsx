import { useState } from "react";
import { channelService } from "@/services/channel/api/channel.service";

export const useChannels = () => {
  const [channels, setChannels] = useState<any[]>([]);

  const fetchChannels = async (search: any) => {
    const data = await channelService.getChannelsV1({ page: 1, limit: 100 });
    setChannels((data as any)?.data || []);
  };

  const fetchChannelsById = async (id: string) => {
    const response = await channelService.getChannelByIdV1(id);
    return (response as any)?.data ?? response;
  };

  const saveChannels = async (data: any) => {
    const response = await channelService.createChannel(data);
    return response;
  };

  const updateChannels = async (data: any, id: string) => {
    const response = await channelService.updateChannel(id, data);
    return response;
  };

  const deleteChannels = async (id: string) => {
    const response = await channelService.deleteChannel(id);
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
