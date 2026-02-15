import {
  GroupResponse,
} from "@/services/masterdata/group.service";
import { authService } from "@/services/auth/api/auth.service";
import { channel } from "process";
import { useState } from "react";

export const useGroup = () => {
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [group, setGroup] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);

  const fetchGroup = async (search: any) => {
    const response: any = await authService.getGroups(search);
    setGroups(response?.data || []);
  };

  const fetchGroupById = async (id: string) => {
    return await authService.getGroupById(id);
  };

  const addGroup = async (data: any) => {
    return await authService.createGroup(data);
  };

  const updateGroup = async (data: any, id: string) => {
    return await authService.updateGroup(id, data);
  };

  const deleteGroup = async (id: string) => {
    return await authService.deleteGroup(id);
  };

  const addGroupRole = async (data: any) => {
    return await authService.addGroupRole(data);
  };

  const removeGroupRole = async (id: string) => {
    return await authService.removeGroupRole(id);
  };

  const addGroupAccount = async (data: any) => {
    return await authService.addAccountGroup(data);
  };

  const removeGroupAccount = async (id: string) => {
    return await authService.removeAccountGroup(id);
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
