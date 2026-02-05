export interface FinanceListResponse<T = unknown> {
  data: T;
  page?: number;
  pageSize?: number;
  pageTotal?: number;
  total?: number;
  [key: string]: unknown;
}
