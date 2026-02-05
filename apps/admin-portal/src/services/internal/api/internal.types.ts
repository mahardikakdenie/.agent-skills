export interface CookiePayload {
  name: string;
  value: string;
  days?: number;
}

export interface CookieResponse {
  data?: {
    value?: string;
  };
  [key: string]: unknown;
}
