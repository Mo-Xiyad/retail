'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { trpc, useTrpcClient } from '../app/_trpc/client';

export function ClientProviders(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark
      }}
    >
      <InnerProvider>{props.children}</InnerProvider>
    </ClerkProvider>
  );
}
const InnerProvider = (props: { children: React.ReactNode }) => {
  const { trpcClient, queryClient } = useTrpcClient();
  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};
