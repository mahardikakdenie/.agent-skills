export const reportKeys = {
  all: ["report"] as const,
  notificationLogs: () => [...reportKeys.all, "notification-logs"] as const,
  notificationLogsList: (params?: Record<string, unknown>) =>
    [...reportKeys.notificationLogs(), "list", params] as const,
  notificationLogDetail: (id: string) =>
    [...reportKeys.notificationLogs(), "detail", id] as const,
};

