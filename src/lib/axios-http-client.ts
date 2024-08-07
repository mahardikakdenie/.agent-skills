// AxiosHttpClient.ts
import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { IHttpClient } from './http-client-interface';

export class AxiosHttpClient implements IHttpClient {
  private apiClient: AxiosInstance;

  constructor(config: CreateAxiosDefaults) {
    this.apiClient = axios.create(config);

    // Add a response interceptor
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('Unauthorized access - redirecting to login');
        }
        return Promise.reject(error);
      }
    );
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.apiClient.post<T>(url, data);
    return response.data;
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.apiClient.get<T>(url);
    return response.data;
  }

  async put<T>(url: string, data: any): Promise<T> {
    const response = await this.apiClient.put<T>(url, data);
    return response.data;
  }
  // Implement other methods as needed
}