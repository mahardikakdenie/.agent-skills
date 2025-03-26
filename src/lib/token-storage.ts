let token: string | null = null;

export const setGlobalToken = (newToken: string | null) => {
  token = newToken;
};

export const getGlobalToken = (): string | null => token;
