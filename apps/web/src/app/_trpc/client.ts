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

// export type TAllUsersOutPut = RouterOutput['user']['getAllUsers'];
// type UserOutPut = RouterInput['post']['create'];

export const useTrpcClient = () => {
  const { getToken, userId } = useAuth();
  console.log('userId', userId);

  const [trpcClient, setTrpcClient] = useState(() =>
    createTrpcClient(getToken)
  );

  useEffect(() => {
    setTrpcClient(() => createTrpcClient(getToken));
  }, [getToken]);

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

const getAppBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  return `http://localhost:3001/api/trpc`;
};
const createTrpcClient = (getToken: () => Promise<string | null>) => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getAppBaseUrl()}`,
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
