export interface CalendarResponse {
  data: unknown;
  page?: number;
  pageSize?: number;
  pageTotal?: number;
  total?: number;
  [key: string]: unknown;
}
