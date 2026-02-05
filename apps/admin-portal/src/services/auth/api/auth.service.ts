import { createApiClient } from "@/lib/api-client";
import qs from "qs";

import { AUTH_ENDPOINTS } from "./auth.endpoints";
import type { LoginCredentials, LoginResponse } from "./auth.types";

const authApi = createApiClient(process.env.NEXT_PUBLIC_AUTH_SERVICE_URL);

const withQuery = (url: string, params?: Record<string, unknown>) => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${qs.stringify(params, { arrayFormat: "brackets" })}`;
};

const get = async <T>(url: string) => (await authApi.get<T>(url)).data;
const post = async <T>(url: string, data?: unknown) =>
  (await authApi.post<T>(url, data)).data;
const put = async <T>(url: string, data?: unknown) =>
  (await authApi.put<T>(url, data)).data;
const del = async <T>(url: string) => (await authApi.delete<T>(url)).data;

export const authService = {
  login: (credentials: LoginCredentials) =>
    post<LoginResponse>(AUTH_ENDPOINTS.login, credentials),

  getAccounts: (params?: Record<string, unknown>) =>
    get(withQuery(AUTH_ENDPOINTS.accounts, params)),
  getAccountById: (id: string) => get(AUTH_ENDPOINTS.accountDetail(id)),
  createAccount: (payload: unknown) => post(AUTH_ENDPOINTS.accounts, payload),
  updateAccount: (id: string, payload: unknown) =>
    put(AUTH_ENDPOINTS.accountDetail(id), payload),
  deleteAccount: (id: string) => del(AUTH_ENDPOINTS.accountDetail(id)),

  getAccountAllDataPagination: (params?: Record<string, unknown>) =>
    get(withQuery(AUTH_ENDPOINTS.accountAllDataPagination, params)),
  getAccountAllDataById: (id: string) =>
    get(AUTH_ENDPOINTS.accountAllDataDetail(id)),
  updateAccountAllData: (id: string, payload: unknown) =>
    put(AUTH_ENDPOINTS.accountAllDataDetail(id), payload),

  getAccountPartners: (params?: Record<string, unknown>) =>
    get(withQuery(AUTH_ENDPOINTS.accountPartners, params)),

  changeAccountPassword: (id: string, payload: unknown) =>
    put(AUTH_ENDPOINTS.accountChangePassword(id), payload),

  addAccountGroup: (payload: unknown) =>
    post(AUTH_ENDPOINTS.accountGroups, payload),
  removeAccountGroup: (id: string) =>
    del(AUTH_ENDPOINTS.accountGroupDetail(id)),

  addAccountRole: (payload: unknown) =>
    post(AUTH_ENDPOINTS.accountRoles, payload),
  removeAccountRole: (id: string) =>
    del(AUTH_ENDPOINTS.accountRoleDetail(id)),

  addAccountChannel: (payload: unknown) =>
    post(AUTH_ENDPOINTS.accountChannels, payload),
  removeAccountChannel: (id: string) =>
    del(AUTH_ENDPOINTS.accountChannelDetail(id)),
  getAccountChannelsByAccount: (accountId: string) =>
    get(AUTH_ENDPOINTS.accountChannelsByAccount(accountId)),

  addAccountInsurer: (payload: unknown) =>
    post(AUTH_ENDPOINTS.accountInsurers, payload),
  removeAccountInsurer: (id: string) =>
    del(AUTH_ENDPOINTS.accountInsurerDetail(id)),
  getAccountInsurersByAccount: (accountId: string) =>
    get(AUTH_ENDPOINTS.accountInsurersByAccount(accountId)),

  getGroups: (params?: Record<string, unknown>) =>
    get(withQuery(AUTH_ENDPOINTS.groups, params)),
  getGroupById: (id: string) => get(AUTH_ENDPOINTS.groupDetail(id)),
  createGroup: (payload: unknown) => post(AUTH_ENDPOINTS.groups, payload),
  updateGroup: (id: string, payload: unknown) =>
    put(AUTH_ENDPOINTS.groupDetail(id), payload),
  deleteGroup: (id: string) => del(AUTH_ENDPOINTS.groupDetail(id)),
  addGroupRole: (payload: unknown) =>
    post(AUTH_ENDPOINTS.groupRoles, payload),
  removeGroupRole: (id: string) =>
    del(AUTH_ENDPOINTS.groupRoleDetail(id)),

  getRoles: (params?: Record<string, unknown>) =>
    get(withQuery(AUTH_ENDPOINTS.roles, params)),
  getRoleById: (id: string) => get(AUTH_ENDPOINTS.roleDetail(id)),
  createRole: (payload: unknown) => post(AUTH_ENDPOINTS.roles, payload),
  updateRole: (id: string, payload: unknown) =>
    put(AUTH_ENDPOINTS.roleDetail(id), payload),
  deleteRole: (id: string) => del(AUTH_ENDPOINTS.roleDetail(id)),

  getPages: (params?: Record<string, unknown>) =>
    get(withQuery(AUTH_ENDPOINTS.pages, params)),
  getPageById: (id: string) => get(AUTH_ENDPOINTS.pageDetail(id)),
  createPage: (payload: unknown) => post(AUTH_ENDPOINTS.pages, payload),
  updatePage: (id: string, payload: unknown) =>
    put(AUTH_ENDPOINTS.pageDetail(id), payload),
  deletePage: (id: string) => del(AUTH_ENDPOINTS.pageDetail(id)),

  getPermissions: (params?: Record<string, unknown>) =>
    get(withQuery(AUTH_ENDPOINTS.permissions, params)),
  getPermissionById: (id: string) => get(AUTH_ENDPOINTS.permissionDetail(id)),
  getPermissionsByPage: (pageId: string, params?: Record<string, unknown>) =>
    get(withQuery(AUTH_ENDPOINTS.permissionByPage(pageId), params)),
  createPermission: (payload: unknown) =>
    post(AUTH_ENDPOINTS.permissions, payload),
  updatePermission: (id: string, payload: unknown) =>
    put(AUTH_ENDPOINTS.permissionDetail(id), payload),
  deletePermission: (id: string) => del(AUTH_ENDPOINTS.permissionDetail(id)),

  createRolePermission: (payload: unknown) =>
    post(AUTH_ENDPOINTS.rolePermissions, payload),
  deleteRolePermission: (id: string) =>
    del(AUTH_ENDPOINTS.rolePermissionDetail(id)),
};

