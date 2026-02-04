import { User, UserService } from "@/services/masterdata/user.service";
import { channel } from "process";
import { useState } from "react";

export const useUser = () => {
  const userService = new UserService();

  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const fetchUser = async (search: any) => {
    const { data } = await userService.getUser(search);
    setUsers(data);
  };

  const fetchChannels = async (search: any) => {
    const { data } = await userService.getChannel(search);
    setChannels(data);
    return data;
  };

  const fetchRole = async (search: any) => {
    const { data } = await userService.getRole(search);
    setRoles(data);
  };

  const fetchUserById = async (id: string) => {
    const response = await userService.getUserById(id);
    return response;
  };

  const saveUser = async (data: any) => {
    const response = await userService.saveUser(data);
    return response;
  };

  const getExistingUser = async (data: any) => {
    return await userService.getExistingUser(data);
  };

  const updateUser = async (data: any, id: string) => {
    const { data: response } = await userService.updateUser(data, id);
    return response;
  };

  const updateUserAllData = async (data: any, id: string) => {
    const { data: response } = await userService.updateUserAllData(data, id);
    return response;
  };

  const deleteUser = async (id: string) => {
    const { data: response } = await userService.deleteUser(id);
    return response;
  };

  const addAccountGroups = async (data: any) => {
    const { data: response } = await userService.addAccountGroups(data);
    return response;
  };

  const removeAccountGroups = async (id: string) => {
    const { data: response } = await userService.removeAccountGroups(id);
    return response;
  };

  const addAccountRoles = async (data: any) => {
    const { data: response } = await userService.addAccountRoles(data);
    return response;
  };

  const removeAccountRoles = async (id: string) => {
    const { data: response } = await userService.removeAccountRoles(id);
    return response;
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
