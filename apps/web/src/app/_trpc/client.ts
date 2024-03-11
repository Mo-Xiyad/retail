import { useAuth } from '@clerk/nextjs';
import type { AppRouter } from '@repo/server';
import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { useEffect, useState } from 'react';
import SuperJSON from 'superjson';

export const trpc = createTRPCReact<AppRouter>({});
type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type TAllUsersOutPut = RouterOutput['user']['getAllUsers'];
// type UserOutPut = RouterInput['post']['create'];

export const useTrpcClient = () => {
  const { getToken } = useAuth();
  const url = '/api/trpc';

  const [trpcClient, setTrpcClient] = useState(() =>
    createTrpcClient(url, getToken)
  );

  useEffect(() => {
    setTrpcClient(() => createTrpcClient(url, getToken));
  }, [url, , getToken]);

  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1
        }
      }
    });
  });

  return {
    trpcClient,
    queryClient
  };
};

const createTrpcClient = (
  url: string,
  getToken: () => Promise<string | null>
) => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: url,
        fetch(url, option) {
          return fetch(url, {
            ...option,
            credentials: 'include'
          });
        },
        headers: async () => {
          return {
            Authorization: `${await getToken()}`
          };
        }
      })
    ],
    transformer: SuperJSON
  });
};
