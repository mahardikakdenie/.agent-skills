export interface NotificationLog {
  id: string;
  type: string;
  stage: string;
  status: string;
  account: string;
  table: string;
  table_id: string;
  table_status: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface NotificationLogsResponse {
  data: NotificationLog[];
  page: number;
  total: number;
  pageTotal: number;
}

export interface GetNotificationLogsParams {
  page?: number;
  limit?: number;
  type?: string;
  stage?: string;
  status?: string;
  account?: string;
  table?: string | string[];
  table_id?: string;
  table_status?: string;
  start_date?: string;
  end_date?: string;
}

