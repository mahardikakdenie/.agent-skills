import { User, UserService } from "@/services/masterdata/user.service";
import { useState } from "react";

export const useUser = () => {
  const userService = new UserService();

  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<any[]>([]);

  // const fetchUser = async (search: any) => {
  //   const users = await userService.getUser();
  //   return users;
  // };

  const fetchUser = async (search: any) => {
    const { data } = await userService.getUser(search);
    setUsers(data);
  };

  const fetchUserById = async (id: string) => {
    const response = await userService.getUserById(id);
    return response;
  };

  const saveUser = async (data: any) => {
    const { data: response } = await userService.saveUser(data);
    return response;
  };

  const updateUser = async (data: any, id: string) => {
    const { data: response } = await userService.updateUser(data, id);
    return response;
  };

  const deleteUser = async (id: string) => {
    const { data: response } = await userService.deleteUser(id);
    return response;
  };

  return {
    user,
    saveUser,
    updateUser,
    deleteUser,
    fetchUser,
    fetchUserById,
    users,
    setUsers,
  };
};
