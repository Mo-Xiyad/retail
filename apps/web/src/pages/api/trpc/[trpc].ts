import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import { Context, appRouter } from '@repo/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';
import { db } from '../../../server/db';

// const createContext = async (ctx: CreateNextContextOptions) => {
//   const userId = getAuth(ctx.req).userId;

//   const user = userId ? await clerkClient.users.getUser(userId) : null;

//   const context: Context = {
//     ...ctx,
//     user: {
//       id: user?.id!,
//       isAdmin: false
//     },
//     db
//   };
//   return context;
// };

// export default trpcNext.createNextApiHandler({
//   router: appRouter,
//   createContext
// });
export default async function handler(req: NextRequest) {
  const userId = getAuth(req).userId;

  const user = userId ? await clerkClient.users.getUser(userId) : null;

  const context: Context = {
    req: req,
    user: {
      id: user?.id!,
      isAdmin: false
    },
    db
  };
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => context,
    onError({ error }) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        console.error('Caught TRPC error:', error);
      }
    }
  });
}
