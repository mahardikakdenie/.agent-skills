import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { helperService } from "../../api/helper.service";
import { helperKeys } from "../../query-keys";

type CreateCalendarResponse = Awaited<
  ReturnType<typeof helperService.createCalendar>
>;
type CreateCalendarPayload = Parameters<typeof helperService.createCalendar>[0];

export function useCreateCalendar(
  options?: UseMutationOptions<CreateCalendarResponse, Error, CreateCalendarPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: helperService.createCalendar,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: helperKeys.calendar() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


