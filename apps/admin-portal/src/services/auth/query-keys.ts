export const authKeys = {
  all: ["auth"] as const,
  accounts: () => [...authKeys.all, "accounts"] as const,
  accountList: (params?: Record<string, unknown>) =>
    [...authKeys.accounts(), "list", params] as const,
  accountDetail: (id: string) => [...authKeys.accounts(), "detail", id] as const,
  accountAllData: () => [...authKeys.accounts(), "all-data"] as const,
  accountAllDataList: (params?: Record<string, unknown>) =>
    [...authKeys.accountAllData(), "list", params] as const,
  accountAllDataDetail: (id: string) =>
    [...authKeys.accountAllData(), "detail", id] as const,
  accountPartners: (params?: Record<string, unknown>) =>
    [...authKeys.accounts(), "partners", params] as const,
  accountChannels: (accountId: string) =>
    [...authKeys.accounts(), "channels", accountId] as const,
  accountInsurers: (accountId: string) =>
    [...authKeys.accounts(), "insurers", accountId] as const,

  groups: () => [...authKeys.all, "groups"] as const,
  groupList: (params?: Record<string, unknown>) =>
    [...authKeys.groups(), "list", params] as const,
  groupDetail: (id: string) => [...authKeys.groups(), "detail", id] as const,

  roles: () => [...authKeys.all, "roles"] as const,
  roleList: (params?: Record<string, unknown>) =>
    [...authKeys.roles(), "list", params] as const,
  roleDetail: (id: string) => [...authKeys.roles(), "detail", id] as const,

  pages: () => [...authKeys.all, "pages"] as const,
  pageList: (params?: Record<string, unknown>) =>
    [...authKeys.pages(), "list", params] as const,
  pageDetail: (id: string) => [...authKeys.pages(), "detail", id] as const,

  permissions: () => [...authKeys.all, "permissions"] as const,
  permissionList: (params?: Record<string, unknown>) =>
    [...authKeys.permissions(), "list", params] as const,
  permissionDetail: (id: string) =>
    [...authKeys.permissions(), "detail", id] as const,
  permissionByPage: (pageId: string, params?: Record<string, unknown>) =>
    [...authKeys.permissions(), "page", pageId, params] as const,

  rolePermissions: () => [...authKeys.all, "role-permissions"] as const,
};
