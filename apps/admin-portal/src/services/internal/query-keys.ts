export const internalKeys = {
  all: ["internal"] as const,
  cookie: () => [...internalKeys.all, "cookie"] as const,
  cookieByKey: (key: string) => [...internalKeys.cookie(), key] as const,
};
