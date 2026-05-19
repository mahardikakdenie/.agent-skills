export const HELPER_ENDPOINTS = {
  htmlToPdf: "/v1/html2pdf",
  htmlToPdfGenerate: "/v1/html2pdf/generate-pdf-service",
  exportData: "/v1/export-data",
  calendar: "/v1/calendar",
  calendarDetail: (id: string) => `/v1/calendar/?id=${id}`,
} as const;
