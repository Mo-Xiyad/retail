import * as companyTables from '@repo/database/company';
import * as userTables from '@repo/database/user';
import { TRPCError, initTRPC } from '@trpc/server';
import type { PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless';
import type { GetServerSidePropsContext } from 'next';
import type { NextRequest } from 'next/server';

import superjson from 'superjson';
export type DataBase = PlanetScaleDatabase<
  typeof companyTables & typeof userTables
>;
export type Context = {
  req: NextRequest | GetServerSidePropsContext['req'] | null;
  user?: {
    id: string;
    isAdmin: boolean;
  };

  db: DataBase;
};
export const createContextInner = async (opts: Context) => {
  return {
    req: opts.req,
    user: opts.user,
    db: opts.db
  };
};

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        user: ctx.user
      }
    });
  })
);
export const adminProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    if (!ctx.user.isAdmin) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only admins can access this route.'
      });
    }

    return next({
      ctx: {
        user: ctx.user
      }
    });
  })
);
