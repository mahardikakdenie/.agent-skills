import {
  PermissionResponse,
  PermissionService,
} from "@/services/masterdata/permission.service";
import { root } from "postcss";
import { useState } from "react";

export const usePermission = () => {
  const permissionService = new PermissionService();
  const [permission, setPermission] = useState<PermissionResponse[]>([]);
  const [groups, setGroups] = useState<any[]>([]);

  const fetchPermission = async (search: any) => {
    const { data } = await permissionService.getPermission(search);
    setPermission(data);
  };

  const savePermission = async (data: any) => {
    const { data: response } = await permissionService.savePermission(data);
    return response;
  };

  const updatePermission = async (data: any, id: string) => {
    const { data: response } = await permissionService.updatePermission(
      data,
      id
    );
    return response;
  };

  const fetchPermissionById = async (id: string) => {
    const response = await permissionService.getPermissionById(id);
    return response;
  };

  const deletePermission = async (id: string) => {
    const { data: response } = await permissionService.deletePermission(id);
    return response;
  };

  const fetchGroups = async (search: any) => {
    const { data } = await permissionService.getPages(search);
    setGroups(data);
  };

  return {
    root,
    savePermission,
    updatePermission,
    deletePermission,
    fetchPermission,
    permissionService,
    permission,
    groups,
    setPermission,
    fetchPermissionById,
    fetchGroups,
  };
};
