import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { productService } from "../../api/product.service";
import { productKeys } from "../../query-keys";

type UploadReferenceHospitalResponse = Awaited<
  ReturnType<typeof productService.uploadReferenceHospital>
>;
type UploadReferenceHospitalPayload = Parameters<
  typeof productService.uploadReferenceHospital
>[0];

export function useUploadReferenceHospital(
  options?: UseMutationOptions<
    UploadReferenceHospitalResponse,
    Error,
    UploadReferenceHospitalPayload
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.uploadReferenceHospital,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: productKeys.references() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}


