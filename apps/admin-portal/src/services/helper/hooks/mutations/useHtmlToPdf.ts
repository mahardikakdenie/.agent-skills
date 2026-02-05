import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { helperService } from "../../api/helper.service";

type HtmlToPdfResponse = Awaited<ReturnType<typeof helperService.htmlToPdf>>;
type HtmlToPdfVariables = Parameters<typeof helperService.htmlToPdf>[0];
type HtmlToPdfFilename = Parameters<typeof helperService.htmlToPdf>[1];

type HtmlToPdfPayload = { content: HtmlToPdfVariables; filename: HtmlToPdfFilename };

export function useHtmlToPdf(
  options?: UseMutationOptions<HtmlToPdfResponse, Error, HtmlToPdfPayload>
) {
  return useMutation({
    mutationFn: ({ content, filename }) => helperService.htmlToPdf(content, filename),
    ...options,
  });
}
