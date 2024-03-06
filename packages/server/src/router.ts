import * as companyTables from '@repo/database/company';
import * as userTables from '@repo/database/user';
import { TRPCError, initTRPC } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless';
import superjson from 'superjson';
export type DataBase = PlanetScaleDatabase<
  typeof companyTables & typeof userTables
>;
export type Context = {
  req: CreateNextContextOptions['req'];
  res: CreateNextContextOptions['res'];
  user?: {
    id: string;
    permissions: string[];
    isAdmin: boolean;
  };

  db: DataBase;
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
