import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import { Context, appRouter } from '@repo/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import * as trpcNext from '@trpc/server/adapters/next';
import { db } from '../../../server/db';

const createContext = async (ctx: CreateNextContextOptions) => {
  const userId = getAuth(ctx.req).userId;
  const user = userId ? await clerkClient.users.getUser(userId) : null;

  const context: Context = {
    ...ctx,
    user: {
      id: user?.id!,
      isAdmin: false
    },
    db
  };
  return context;
};

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext
});
