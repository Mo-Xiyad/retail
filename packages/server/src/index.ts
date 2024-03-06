import type { Context, DataBase } from './router';
import { router } from './router';
import { companyRouter } from './routes/company';

import { testRouter } from './routes/test';
import { usersRouter } from './routes/user';

export const appRouter = router({
  test: testRouter,
  user: usersRouter,
  company: companyRouter
});

export type AppRouter = typeof appRouter;

export { Context, DataBase };
