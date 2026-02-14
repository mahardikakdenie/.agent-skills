import { AxiosHeaders, type AxiosInstance } from "axios";

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
        const headers = AxiosHeaders.from(config.headers);
        headers.set("Authorization", token);
        config.headers = headers;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};
