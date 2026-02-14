export const REPORT_ENDPOINTS = {
  notificationLogs: "/v1/notification-logs",
  notificationLogDetail: (id: string) => `/v1/notification-logs/${id}`,
} as const;

