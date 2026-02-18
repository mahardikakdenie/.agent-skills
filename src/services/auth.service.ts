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

interface LoginProvidersRequest {
  originUrl: string
}

export interface LoginProvidersResponse {
  client_id: string;
  client_secret: string;
  tenant_id: string;
  origin_url: string;
  redirect_url: string;
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

  async loginEntra(code: string, codeVerifier: string): Promise<LoginResponse> {
    try {
      const redirectUri = process.env.NEXT_PUBLIC_AZURE_AD_REDIRECT_URI || "https://localhost:3000/oauth/msal";
      return await this.httpClient.post<LoginResponse>('/login/entra', { 
        code,
        redirectUri,
        codeVerifier
      });
    } catch (error) {
      console.error('Entra Login failed:', error);
      throw error;
    }
  }

  async getProviders(payload: LoginProvidersRequest): Promise<{data: LoginProvidersResponse[]}> {
    try {
      const path = `/v1/providers?originUrl=${encodeURIComponent(payload.originUrl)}`;
      
      return this.httpClient.get<{data: LoginProvidersResponse[]}>(path);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
}