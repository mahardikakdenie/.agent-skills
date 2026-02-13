export const msalConfig = {
  auth: {
    authority: (tenantId: string) => `https://login.microsoftonline.com/${tenantId}`,
  },
};
