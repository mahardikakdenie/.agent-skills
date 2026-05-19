import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { thirdPartyService } from "../../api/third-party.service";
import { thirdPartyKeys } from "../../query-keys";

type DeleteThirdPartyConfigurationResponse = Awaited<
  ReturnType<typeof thirdPartyService.deleteConfiguration>
>;

export function useDeleteThirdPartyConfiguration(
  options?: UseMutationOptions<
    DeleteThirdPartyConfigurationResponse,
    Error,
    string
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: thirdPartyService.deleteConfiguration,
    ...options,
    onSuccess: (data, id, context, mutation) => {
      queryClient.removeQueries({
        queryKey: thirdPartyKeys.configurationDetail(id),
      });
      queryClient.invalidateQueries({
        queryKey: thirdPartyKeys.configurations(),
      });
      options?.onSuccess?.(data, id, context, mutation);
    },
  });
}
