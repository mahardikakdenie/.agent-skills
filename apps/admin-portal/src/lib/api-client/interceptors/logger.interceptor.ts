import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const logRequest = (config: AxiosRequestConfig) => {
  const method = (config.method || "GET").toUpperCase();
  const url = `${config.baseURL ?? ""}${config.url ?? ""}`;
  console.debug(`[api] ${method} ${url}`);
};

const logResponse = (response: AxiosResponse) => {
  const method = (response.config.method || "GET").toUpperCase();
  const url = `${response.config.baseURL ?? ""}${response.config.url ?? ""}`;
  console.debug(`[api] ${method} ${url} -> ${response.status}`);
};

export const applyLoggerInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      logRequest(config);
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => {
      logResponse(response);
      return response;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};
