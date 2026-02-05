import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { helperService } from "../../api/helper.service";
import { helperKeys } from "../../query-keys";

type UpdateCalendarResponse = Awaited<
  ReturnType<typeof helperService.updateCalendar>
>;
type UpdateCalendarPayload = Parameters<typeof helperService.updateCalendar>[1];
type UpdateCalendarVariables = { id: string; payload: UpdateCalendarPayload };

export function useUpdateCalendar(
  options?: UseMutationOptions<UpdateCalendarResponse, Error, UpdateCalendarVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => helperService.updateCalendar(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: helperKeys.calendar() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: helperKeys.calendarDetail(variables.id),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


