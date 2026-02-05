import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { pdfService } from "../../api/pdf.service";

type GeneratePdfResponse = Awaited<ReturnType<typeof pdfService.generatePdf>>;
type GeneratePdfPayload = Parameters<typeof pdfService.generatePdf>[0];

export function useGeneratePdf(
  options?: UseMutationOptions<GeneratePdfResponse, Error, GeneratePdfPayload>
) {
  return useMutation({
    mutationFn: pdfService.generatePdf,
    ...options,
  });
}
