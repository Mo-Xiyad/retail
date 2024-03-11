import * as backendTrpc from '@repo/server';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  backend: backendTrpc.appRouter
});

export type AppRouter = typeof appRouter;
