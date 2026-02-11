// report.service.ts
import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";

interface NotificationLog {
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
  [key: string]: any;
}

interface NotificationLogsResponse {
  data: NotificationLog[];
  page: number;
  total: number;
  pageTotal: number;
}

interface GetNotificationLogsParams {
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

export class ReportService {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = new AxiosHttpClient(
      {
        baseURL: process.env.NEXT_PUBLIC_REPORT_SERVICE_URL,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REPORT_SERVICE_TOKEN}`,
        },
      },
      true,
    );
  }

  async getNotificationLogs(
    params: GetNotificationLogsParams = {},
  ): Promise<NotificationLogsResponse> {
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/notification-logs?${queryString}`);
  }

  async getNotificationLogById(id: string): Promise<NotificationLog> {
    return this.httpClient.get(`/v1/notification-logs/${id}`);
  }
}
