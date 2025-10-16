import {
  GroupResponse,
  GroupService,
} from "@/services/masterdata/group.service";
import { channel } from "process";
import { useState } from "react";

export const useGroup = () => {
  const groupService = new GroupService();

  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [group, setGroup] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);

  const fetchGroup = async (search: any) => {
    const { data } = await groupService.getGroup(search);
    setGroups(data);
  };

  const fetchGroupById = async (id: string) => {
    const response = await groupService.getGroupById(id);
    return response;
  };

  const addGroup = async (data: any) => {
    const { data: response } = await groupService.addGroup(data);
    return response;
  };

  const updateGroup = async (data: any, id: string) => {
    const { data: response } = await groupService.updateGroup(data, id);
    return response;
  };

  const deleteGroup = async (id: string) => {
    const { data: response } = await groupService.deleteGroup(id);
    return response;
  };

  const addGroupRole = async (data: any) => {
    const { data: response } = await groupService.addGroupRole(data);
    return response;
  };

  const removeGroupRole = async (id: string) => {
    const { data: response } = await groupService.removeGroupRole(id);
    return response;
  };

  const addGroupAccount = async (data: any) => {
    const { data: response } = await groupService.addGroupAccount(data);
    return response;
  };

  const removeGroupAccount = async (id: string) => {
    const { data: response } = await groupService.removeGroupAccount(id);
    return response;
  };

  return {
    group,
    addGroup,
    updateGroup,
    deleteGroup,
    fetchGroup,
    fetchGroupById,
    groups,
    setGroups,
    channel,
    channels,
    addGroupRole,
    removeGroupRole,
    addGroupAccount,
    removeGroupAccount,
  };
};
