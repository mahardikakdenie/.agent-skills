import axios, { AxiosInstance } from "axios";
import { getGlobalToken } from "./token-storage";

const getAuthorizationToken = () => {
  const token = getGlobalToken();
  return token ? `Bearer ${token}` : null;
};

const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = getAuthorizationToken();
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized access - redirecting to login");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const createApiClient = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL || process.env.NEXT_PUBLIC_API_CLAIM_BASE_URL,
  });

  return setupInterceptors(instance);
};

const defaultInterceptor = createApiClient();

export default defaultInterceptor;
