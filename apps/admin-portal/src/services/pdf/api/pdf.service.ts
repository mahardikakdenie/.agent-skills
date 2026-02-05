import { createApiClient } from "@/lib/api-client";

import { PDF_ENDPOINTS } from "./pdf.endpoints";
import type { PdfGenerateRequest } from "./pdf.types";

const pdfApi = createApiClient(process.env.NEXT_PUBLIC_PDF_SERVICE_URL);

const post = async <T>(url: string, data?: unknown) =>
  (await pdfApi.post<T>(url, data)).data;

export const pdfService = {
  generatePdf: (payload: PdfGenerateRequest) =>
    post(PDF_ENDPOINTS.generate, payload),
};

