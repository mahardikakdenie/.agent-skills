export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export type { User, Channel, Role } from "@/services/masterdata/user.service";
export type {
  GroupResponse,
  RoleResponse as GroupRoleResponse,
  UserResponse,
  AccountGroup,
} from "@/services/masterdata/group.service";
export type {
  RoleResponse,
  PermissionResponse as RolePermissionResponse,
} from "@/services/masterdata/roles.service";
export type {
  PermissionResponse,
  PagesResponse as PermissionPagesResponse,
} from "@/services/masterdata/permission.service";
export type { PagesResponse } from "@/services/masterdata/page.service";
