export const SANCTION_ENDPOINTS = {
  sources: "/v1/sources",
  sourceDetail: (id: string) => `/v1/sources/${id}`,
  sourcesPaging: "/v1/sources/paging",
  sourceDelete: (id: string) => `/v1/sources/delete/${id}`,
  sourceUpdate: (id: string) => `/v1/sources/update/${id}`,
  blacklist: "/v1/blacklist",
  blacklistDetail: (id: string) => `/v1/blacklist/${id}`,
  blacklistDelete: (id: string) => `/v1/blacklist/delete/${id}`,
  blacklistUpdate: (id: string) => `/v1/blacklist/update/${id}`,
} as const;
