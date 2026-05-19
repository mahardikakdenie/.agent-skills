import { API_BASE_URLS, createApiClient } from "@/lib/api-client";
import qs from "qs";

import type {
  GetNotificationLogsParams,
  NotificationLog,
  NotificationLogsResponse,
} from "./report.types";
import { REPORT_ENDPOINTS } from "./report.endpoints";

const reportApi = createApiClient({
  baseURL: API_BASE_URLS.report,
  withAuth: false,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_REPORT_SERVICE_TOKEN}`,
  },
});

const withQuery = (url: string, params?: Record<string, unknown>) => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${qs.stringify(params, { arrayFormat: "brackets" })}`;
};

const get = async <T>(url: string) => (await reportApi.get<T>(url)).data;

export const reportService = {
  getNotificationLogs: (params?: GetNotificationLogsParams) =>
    get<NotificationLogsResponse>(
      withQuery(
        REPORT_ENDPOINTS.notificationLogs,
        params as Record<string, unknown> | undefined
      )
    ),
  getNotificationLogById: (id: string) =>
    get<NotificationLog>(REPORT_ENDPOINTS.notificationLogDetail(id)),
};

