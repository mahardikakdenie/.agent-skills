import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { helperService } from "../../api/helper.service";

type GeneratePdfResponse = Awaited<
  ReturnType<typeof helperService.generatePdfService>
>;
type GeneratePdfContent = Parameters<typeof helperService.generatePdfService>[0];
type GeneratePdfFilename = Parameters<typeof helperService.generatePdfService>[1];

type GeneratePdfPayload = {
  content: GeneratePdfContent;
  filename: GeneratePdfFilename;
};

export function useGeneratePdfService(
  options?: UseMutationOptions<GeneratePdfResponse, Error, GeneratePdfPayload>
) {
  return useMutation({
    mutationFn: ({ content, filename }) =>
      helperService.generatePdfService(content, filename),
    ...options,
  });
}
