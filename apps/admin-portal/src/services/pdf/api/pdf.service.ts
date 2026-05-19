import { API_BASE_URLS, createApiClient } from "@/lib/api-client";

import { PDF_ENDPOINTS } from "./pdf.endpoints";
import type { PdfGenerateRequest } from "./pdf.types";

const pdfApi = createApiClient(API_BASE_URLS.pdf);

const post = async <T>(url: string, data?: unknown) =>
  (await pdfApi.post<T>(url, data)).data;

export const pdfService = {
  generatePdf: (payload: PdfGenerateRequest) =>
    post(PDF_ENDPOINTS.generate, payload),
};

