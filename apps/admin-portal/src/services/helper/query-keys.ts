export const helperKeys = {
  all: ["helper"] as const,
  calendar: () => [...helperKeys.all, "calendar"] as const,
  calendarList: (params?: Record<string, unknown>) =>
    [...helperKeys.calendar(), "list", params] as const,
  calendarDetail: (id: string) =>
    [...helperKeys.calendar(), "detail", id] as const,
};
