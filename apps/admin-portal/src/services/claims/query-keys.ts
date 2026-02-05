export const claimKeys = {
  all: ["claims"] as const,
  lists: () => [...claimKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...claimKeys.lists(), params] as const,
  detail: (id: string) => [...claimKeys.all, "detail", id] as const,
  configurations: () => [...claimKeys.all, "configurations"] as const,
  export: (params?: Record<string, unknown>) =>
    [...claimKeys.all, "export", params] as const,
  importDataGuide: (params?: Record<string, unknown>) =>
    [...claimKeys.all, "import-data-guide", params] as const,
  listLimit: (params?: Record<string, unknown>) =>
    [...claimKeys.all, "list-limit", params] as const,
  statistics: (params?: Record<string, unknown>) =>
    [...claimKeys.all, "statistics", params] as const,
  histories: (params?: Record<string, unknown>) =>
    [...claimKeys.all, "histories", params] as const,
  categoryForms: (id: string, params?: Record<string, unknown>) =>
    [...claimKeys.all, "category-forms", id, params] as const,
  channelForms: (id: string) => [...claimKeys.all, "channel-forms", id] as const,
};
