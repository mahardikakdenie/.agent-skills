import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { thirdPartyService } from "../../api/third-party.service";
import type { ThirdPartyConfigPayload } from "../../api/third-party.types";
import { thirdPartyKeys } from "../../query-keys";

type UpdateThirdPartyConfigurationResponse = Awaited<
  ReturnType<typeof thirdPartyService.updateConfiguration>
>;
type UpdateThirdPartyConfigurationVariables = {
  id: string;
  data: Partial<ThirdPartyConfigPayload>;
};

export function useUpdateThirdPartyConfiguration(
  options?: UseMutationOptions<
    UpdateThirdPartyConfigurationResponse,
    Error,
    UpdateThirdPartyConfigurationVariables
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      thirdPartyService.updateConfiguration(id, data),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: thirdPartyKeys.configurationDetail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: thirdPartyKeys.configurations(),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
