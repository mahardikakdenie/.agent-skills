import type { AxiosError, AxiosInstance } from "axios";

export const applyErrorInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized access - redirecting to login");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
