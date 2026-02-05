"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { ReactQueryDevtools } from "./devtools";
import { createQueryClient } from "./query-client";

interface QueryProviderProps {
  children: React.ReactNode;
  enableDevtools?: boolean;
}

export function QueryProvider({
  children,
  enableDevtools = false,
}: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {enableDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
