import { RoleResponse, RoleService } from "@/services/masterdata/roles.service";
import { useState } from "react";

export const useRole = () => {
  const roleService = new RoleService();

  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [role, setRole] = useState<any[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [permission, setPermission] = useState<any[]>([]);

  const fetchRole = async (search: any) => {
    const { data } = await roleService.getRole(search);
    setRoles(data);
  };

  const fetchRoleById = async (id: string) => {
    const response = await roleService.getRoleById(id);
    return response;
  };

  const addRole = async (data: any, id: string) => {
    const { data: response } = await roleService.addRole(data, id);
    return response;
  };

  const updateRole = async (data: any, id: string) => {
    const { data: response } = await roleService.updateRole(data, id);
    return response;
  };

  const deleteRole = async (id: string) => {
    const { data: response } = await roleService.deleteRole(id);
    return response;
  };

  const fetchMenu = async (search: any) => {
    const { data } = await roleService.getMenu(search);
    setMenu(data);
  };

  const fetchPermission = async (search: any) => {
    const { data } = await roleService.getPermission(search);
    setPermission(data);
  };

  const addPermissionRole = async (data: any, id: string) => {
    const { data: response } = await roleService.savePermissionRole(data, id);
    return response;
  };

  return {
    role,
    addRole,
    updateRole,
    deleteRole,
    fetchRole,
    fetchRoleById,
    roles,
    setRoles,
    menu,
    fetchMenu,
    fetchPermission,
    addPermissionRole,
  };
};
