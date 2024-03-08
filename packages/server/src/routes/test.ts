import { publicProcedure, router } from '../router';
export const testRouter = router({
  getUser: publicProcedure.query(({ input, ctx }) => {
    return {
      name: 'John Doe',
      email: 'john@gmail.com'
    };
  })
});
