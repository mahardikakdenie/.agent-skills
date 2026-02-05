export const sanctionKeys = {
  all: ["sanction"] as const,
  sources: () => [...sanctionKeys.all, "sources"] as const,
  sourceList: (params?: Record<string, unknown>) =>
    [...sanctionKeys.sources(), "list", params] as const,
  sourceDetail: (id: string) =>
    [...sanctionKeys.sources(), "detail", id] as const,

  blacklist: () => [...sanctionKeys.all, "blacklist"] as const,
  blacklistList: (params?: Record<string, unknown>) =>
    [...sanctionKeys.blacklist(), "list", params] as const,
  blacklistDetail: (id: string) =>
    [...sanctionKeys.blacklist(), "detail", id] as const,
};
