"use client";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
