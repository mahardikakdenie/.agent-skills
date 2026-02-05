import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

export const createQueryClient = (config?: QueryClientConfig) =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
    ...config,
  });
