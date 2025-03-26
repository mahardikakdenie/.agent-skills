// AxiosHttpClient.ts
import axios, { AxiosInstance, CreateAxiosDefaults, AxiosRequestConfig } from "axios";
import { IHttpClient } from "./http-client-interface";
import { getGlobalToken } from "./token-storage";

const defaultConfig: CreateAxiosDefaults = {
  headers: {
    "Content-Type": "application/json",
  },
};

export class AxiosHttpClient implements IHttpClient {
  private apiClient: AxiosInstance;
  private requestConfig: AxiosRequestConfig | undefined;
  private isCustomAuthValue: boolean;

  constructor(requestConfig?: AxiosRequestConfig, isCustomAuthValue: boolean = false) {
    this.requestConfig = requestConfig;
    this.isCustomAuthValue = isCustomAuthValue;
    this.apiClient = axios.create(defaultConfig);

    // Add a response interceptor
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error("Unauthorized access - redirecting to login");
        }
        return Promise.reject(error);
      }
    );
  }

  private async getAuthorizationToken(): Promise<string | null> {
    const token = getGlobalToken();
    return token ? `Bearer ${token}` : null;
  }

  private async getRequestConfig(): Promise<AxiosRequestConfig> {
    if (!!this.requestConfig && this.isCustomAuthValue) return this.requestConfig;

    const authToken = await this.getAuthorizationToken();
    return {
      ...this.requestConfig,
      headers: {
        ...this.requestConfig?.headers,
        Authorization: authToken || "",
      },
    };
  }

  async post<T>(url: string, data: any): Promise<T> {
    const finalConfig = await this.getRequestConfig();
    const response = await this.apiClient.post<T>(url, data, finalConfig);
    return response.data;
  }

  async get<T>(url: string): Promise<T> {
    const finalConfig = await this.getRequestConfig();
    const response = await this.apiClient.get<T>(url, finalConfig);
    return response.data;
  }

  async put<T>(url: string, data: any): Promise<T> {
    const finalConfig = await this.getRequestConfig();
    const response = await this.apiClient.put<T>(url, data, finalConfig);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const finalConfig = await this.getRequestConfig();
    const response = await this.apiClient.delete<T>(url, finalConfig);
    return response.data;
  }

  // Implement other methods as needed
}
