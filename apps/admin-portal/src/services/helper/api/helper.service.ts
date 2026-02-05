import { createApiClient } from "@/lib/api-client";
import qs from "qs";

import { HELPER_ENDPOINTS } from "./helper.endpoints";

const helperApi = createApiClient(process.env.NEXT_PUBLIC_HELPER_SERVICE_URL);

const withQuery = (url: string, params?: Record<string, unknown>) => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${qs.stringify(params, { arrayFormat: "brackets" })}`;
};

const get = async <T>(url: string) => (await helperApi.get<T>(url)).data;
const post = async <T>(url: string, data?: unknown) =>
  (await helperApi.post<T>(url, data)).data;
const put = async <T>(url: string, data?: unknown) =>
  (await helperApi.put<T>(url, data)).data;
const del = async <T>(url: string) => (await helperApi.delete<T>(url)).data;

export const helperService = {
  htmlToPdf: (content: string, filename: string) =>
    post(HELPER_ENDPOINTS.htmlToPdf, { content, filename }),
  generatePdfService: (content: string, filename: string) =>
    post(HELPER_ENDPOINTS.htmlToPdfGenerate, { content, filename }),

  getCalendar: (params?: Record<string, unknown>) =>
    get(withQuery(HELPER_ENDPOINTS.calendar, params)),
  getCalendarById: (id: string) => get(HELPER_ENDPOINTS.calendarDetail(id)),
  createCalendar: (payload: unknown) => post(HELPER_ENDPOINTS.calendar, payload),
  updateCalendar: (id: string, payload: unknown) =>
    put(HELPER_ENDPOINTS.calendarDetail(id), payload),
  deleteCalendar: (id: string) => del(HELPER_ENDPOINTS.calendarDetail(id)),
};

