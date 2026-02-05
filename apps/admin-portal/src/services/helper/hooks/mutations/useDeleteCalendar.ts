import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { helperService } from "../../api/helper.service";
import { helperKeys } from "../../query-keys";

type DeleteCalendarResponse = Awaited<
  ReturnType<typeof helperService.deleteCalendar>
>;
type DeleteCalendarVariables = Parameters<typeof helperService.deleteCalendar>[0];

export function useDeleteCalendar(
  options?: UseMutationOptions<DeleteCalendarResponse, Error, DeleteCalendarVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: helperService.deleteCalendar,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: helperKeys.calendar() });
      if (variables) {
        queryClient.invalidateQueries({
          queryKey: helperKeys.calendarDetail(variables),
        });
      }
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


