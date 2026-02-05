export const INTERNAL_ENDPOINTS = {
  cookie: "/api/cookie",
  cookieDetail: (key: string) => `/api/cookie/${key}`,
} as const;
