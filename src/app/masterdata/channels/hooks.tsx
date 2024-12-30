import {
  ChannelsResponse,
  ChannelsService,
} from "@/services/masterdata/channels.service";
import { useState } from "react";

export const useChannels = () => {
  const channelsService = new ChannelsService();

  const [channels, setChannels] = useState<ChannelsResponse[]>([]);

  const fetchChannels = async (search: any) => {
    const { data } = await channelsService.getChannels();
    setChannels(data);
  };

  const fetchChannelsById = async (id: string) => {
    const response = await channelsService.getChannelsById(id);
    return response;
  };

  const saveChannels = async (data: any) => {
    const { data: response } = await channelsService.saveChannels(data);
    return response;
  };

  const updateChannels = async (data: any, id: string) => {
    const { data: response } = await channelsService.updateChannels(data, id);
    return response;
  };

  const deleteChannels = async (id: string) => {
    const { data: response } = await channelsService.deleteChannels(id);
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
