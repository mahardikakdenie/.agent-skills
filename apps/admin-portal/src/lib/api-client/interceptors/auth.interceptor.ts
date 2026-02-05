import type { AxiosInstance } from "axios";

import { getGlobalToken } from "@/lib/token-storage";

const getAuthorizationToken = () => {
  const token = getGlobalToken();
  return token ? `Bearer ${token}` : null;
};

export const applyAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = getAuthorizationToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};
