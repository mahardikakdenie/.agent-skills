export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
}

export interface LoginProvidersRequest {
  originUrl: string;
}

export interface LoginProvidersResponse {
  client_id: string;
  client_secret: string;
  tenant_id: string;
  origin_url: string;
  redirect_url: string;
}

export interface User {
  data: any;
  id: string;
  name: string;
  email: string;
  phone_number: string;
  permission: string;
  role: string;
  status: string;
  meta: any;
}

export interface Channel {
  data: any;
  id: string;
  name: string;
  type: string;
}

export interface Role {
  data: any;
  id: string;
  name: string;
  description: string;
}

export interface GroupResponse {
  data: any;
  id: string;
  name: string;
  description: string;
  updated_at: string;
  created_at: string;
  _count: any;
  meta: any;
  group_roles: any;
  account_groups: any;
}

export interface GroupRoleResponse {
  data: any;
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  description: string;
  meta: any;
}

export interface UserResponse {
  data: any;
  id: string;
  name: string;
  email: string;
  phone_number: number;
  status: string;
  role: string;
  meta: any;
}

export interface AccountGroup {
  id: string;
  accounts: {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    role: string;
    channel: string;
    updated_at: string;
  };
}

export interface RoleResponse {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  name: string;
  description: string;
  data: any;
  meta: any;
}

export interface RolePermissionResponse {
  id: string;
  name: string;
  updated_at: string;
  created_at: string;
  page: string;
  data: any;
  meta: any;
}

export interface PermissionResponse {
  data: any;
  page: any;
  total: any;
  pageTotal: any;
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  meta: any;
}

export interface PermissionPagesResponse {
  data: any;
  id: string;
  name: string;
  meta: any;
}

export interface PagesResponse {
  data: any;
  id: string;
  created_at: string;
  updated_at: any;
  name: string;
  claim_config: string;
  page: any;
  total: any;
  pageTotal: any;
  meta: any;
}

export interface MenuResponse {
  id: string;
  name: string;
  updated_at: string;
  created_at: string;
  data: any;
}

export interface Insurer {
  data: any;
  id: string;
  name: string;
  type: string;
}
