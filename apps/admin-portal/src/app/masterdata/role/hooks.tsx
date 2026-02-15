import { authService } from "@/services/auth/api/auth.service";
import type { RoleResponse } from "@/services/masterdata/roles.service";
import { useState } from "react";

export const useRole = () => {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [role, setRole] = useState<any[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [permission, setPermission] = useState<any[]>([]);

  const fetchRole = async (search: any) => {
    const response: any = await authService.getRoles(search);
    setRoles(response?.data || []);
  };

  const fetchRoleById = async (id: string) => {
    return await authService.getRoleById(id);
  };

  const addRole = async (data: any) => {
    return await authService.createRole(data);
  };

  const updateRole = async (data: any, id: string) => {
    return await authService.updateRole(id, data);
  };

  const deleteRole = async (id: string) => {
    return await authService.deleteRole(id);
  };

  const fetchMenu = async (search: any) => {
    const response: any = await authService.getPages(search);
    setMenu(response?.data || []);
  };

  const fetchPermission = async (search: any) => {
    const response: any = await authService.getPermissionsByPage(
      search?.pagesId,
      search,
    );
    setPermission(response?.data || []);
  };

  const addPermissionRole = async (data: any) => {
    return await authService.createRolePermission(data);
  };

  const deletePermissionRole = async (id: string) => {
    return await authService.deleteRolePermission(id);
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
    deletePermissionRole,
  };
};
