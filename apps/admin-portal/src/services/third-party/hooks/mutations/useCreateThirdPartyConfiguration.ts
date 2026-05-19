import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { thirdPartyService } from "../../api/third-party.service";
import type { ThirdPartyConfigPayload } from "../../api/third-party.types";
import { thirdPartyKeys } from "../../query-keys";

type CreateThirdPartyConfigurationResponse = Awaited<
  ReturnType<typeof thirdPartyService.createConfiguration>
>;

export function useCreateThirdPartyConfiguration(
  options?: UseMutationOptions<
    CreateThirdPartyConfigurationResponse,
    Error,
    ThirdPartyConfigPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: thirdPartyService.createConfiguration,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: thirdPartyKeys.configurations(),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
