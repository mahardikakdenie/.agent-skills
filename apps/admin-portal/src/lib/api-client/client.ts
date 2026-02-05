import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

import { API_DEFAULT_HEADERS, API_TIMEOUT_MS } from "./config";
import { applyAuthInterceptor } from "./interceptors/auth.interceptor";
import { applyErrorInterceptor } from "./interceptors/error.interceptor";
import { applyLoggerInterceptor } from "./interceptors/logger.interceptor";

export type ApiClientOptions = AxiosRequestConfig & {
  baseURL?: string;
  withAuth?: boolean;
  withLogger?: boolean;
};

const toOptions = (input?: string | ApiClientOptions): ApiClientOptions => {
  if (!input) return {};
  if (typeof input === "string") return { baseURL: input };
  return input;
};

export const createApiClient = (
  input?: string | ApiClientOptions
): AxiosInstance => {
  const options = toOptions(input);
  const {
    baseURL,
    withAuth = true,
    withLogger = false,
    headers,
    ...rest
  } = options;

  const instance = axios.create({
    baseURL,
    timeout: API_TIMEOUT_MS,
    headers: {
      ...API_DEFAULT_HEADERS,
      ...headers,
    },
    ...rest,
  });

  if (withAuth) {
    applyAuthInterceptor(instance);
  }
  applyErrorInterceptor(instance);
  if (withLogger) {
    applyLoggerInterceptor(instance);
  }

  return instance;
};
