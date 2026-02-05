export interface SanctionResponse {
  data: unknown;
  limit?: number;
  page?: number;
  pageTotal?: number;
  total?: number;
  [key: string]: unknown;
}

export interface Insurer {
  insurance: string;
}
