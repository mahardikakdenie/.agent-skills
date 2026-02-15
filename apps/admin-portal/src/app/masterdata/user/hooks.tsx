import { authService } from "@/services/auth/api/auth.service";
import { channelService } from "@/services/channel/api/channel.service";
import type { User } from "@/services/masterdata/user.service";
import { channel } from "process";
import { useState } from "react";

export const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const fetchUser = async (search: any) => {
    const response: any = await authService.getAccounts(search);
    setUsers(response?.data || []);
  };

  const fetchChannels = async (search: any) => {
    const response: any = await channelService.getChannelsV1({
      ...search,
      limit: 1000,
    });
    const data = response?.data || [];
    setChannels(data);
    return data;
  };

  const fetchRole = async (search: any) => {
    const response: any = await authService.getRoles(search);
    setRoles(response?.data || []);
  };

  const fetchUserById = async (id: string) => {
    return await authService.getAccountById(id);
  };

  const saveUser = async (data: any) => {
    return await authService.createAccount(data);
  };

  const getExistingUser = async (data: any) => {
    return await authService.getAccountAllDataPagination({
      page: 1,
      pageSize: 1,
      ...data,
    });
  };

  const updateUser = async (data: any, id: string) => {
    return await authService.updateAccount(id, data);
  };

  const updateUserAllData = async (data: any, id: string) => {
    return await authService.updateAccountAllData(id, data);
  };

  const deleteUser = async (id: string) => {
    return await authService.deleteAccount(id);
  };

  const addAccountGroups = async (data: any) => {
    return await authService.addAccountGroup(data);
  };

  const removeAccountGroups = async (id: string) => {
    return await authService.removeAccountGroup(id);
  };

  const addAccountRoles = async (data: any) => {
    return await authService.addAccountRole(data);
  };

  const removeAccountRoles = async (id: string) => {
    return await authService.removeAccountRole(id);
  };

  return {
    user,
    saveUser,
    getExistingUser,
    addAccountGroups,
    removeAccountGroups,
    addAccountRoles,
    removeAccountRoles,
    updateUser,
    updateUserAllData,
    deleteUser,
    fetchUser,
    fetchUserById,
    users,
    setUsers,
    channel,
    channels,
    fetchChannels,
    fetchRole,
    roles,
    setRoles,
  };
};
