import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { authService } from "../../api/auth.service";

type LoginResponse = Awaited<ReturnType<typeof authService.login>>;
type LoginPayload = Parameters<typeof authService.login>[0];

export function useLogin(
  options?: UseMutationOptions<LoginResponse, Error, LoginPayload>
) {
  return useMutation({
    mutationFn: authService.login,
    ...options,
  });
}
