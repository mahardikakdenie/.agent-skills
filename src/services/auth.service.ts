// AuthService.ts
import { AxiosHttpClient } from '@/lib/axios-http-client';
import { IHttpClient } from '@/lib/http-client-interface';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export class AuthService {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      }
    }, true);
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      return await this.httpClient.post<LoginResponse>('/login', credentials);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async loginEntra(code: string): Promise<LoginResponse> {
    try {
      return await this.httpClient.post<LoginResponse>('/login/entra', { code });
    } catch (error) {
      console.error('Entra Login failed:', error);
      throw error;
    }
  }
}