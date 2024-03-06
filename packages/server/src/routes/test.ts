import { publicProcedure, router } from '../router';
export const testRouter = router({
  getUser: publicProcedure.query(({ input, ctx }) => {
    return ctx.user;
  })
});
