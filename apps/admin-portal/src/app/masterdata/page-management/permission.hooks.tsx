import { GroupResponse } from "@/services/masterdata/group.service";
import {
  PermissionResponse,
} from "@/services/masterdata/permission.service";
import { authService } from "@/services/auth/api/auth.service";
import { useState } from "react";

export const usePermission = () => {
  const [permission, setPermission] = useState<PermissionResponse[]>([]);
  const [groups, setGroups] = useState<GroupResponse[]>([]);

  const fetchPermission = async (search: any) => {
    const response: any = await authService.getPermissionsByPage(
      search?.pagesId,
      search,
    );
    setPermission(response?.data || []);
  };

  const savePermission = async (data: any) => {
    return await authService.createPermission(data);
  };

  const updatePermission = async (data: any, id: string) => {
    return await authService.updatePermission(id, data);
  };

  const fetchPermissionById = async (id: string) => {
    return await authService.getPermissionById(id);
  };

  const deletePermission = async (id: string) => {
    return await authService.deletePermission(id);
  };

  const fetchGroups = async (search: any) => {
    const response: any = await authService.getPages(search);
    setGroups(response?.data || []);
  };

  return {
    savePermission,
    updatePermission,
    deletePermission,
    fetchPermission,
    permission,
    groups,
    setPermission,
    fetchPermissionById,
    fetchGroups,
  };
};
