import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  afterAuth: async (auth, req, evt) => {
    const pathName = req.nextUrl.pathname;

    //if path not found, redirect to 404
    if (pathName.startsWith('/404')) {
      return NextResponse.next();
    }

    // return NextResponse.rewrite(new URL(`/`, req.url));
  },
  publicRoutes: ['/404', '/sign-in(.*)', '/unauthorised', '/api/webhook/clerk'],
  ignoredRoutes: ['/api/trpc/[trpc]', 'api/webhook/clerk']
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
