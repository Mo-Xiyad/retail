import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

const allowedRoutes = ['/', '/sign-in', '/unauthorised', '/404'];
export default authMiddleware({
  afterAuth: async (auth, req, evt) => {
    const pathName = req.nextUrl.pathname;

    // if (allowedRoutes.includes(pathName)) {
    //   return NextResponse.next();
    // }

    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL(`/sign-in`, req.url));
    }

    if (pathName.startsWith('/sign-in')) {
      if (auth.userId) return NextResponse.redirect(new URL(`/`, req.url));
    }

    if (auth.isPublicRoute) {
      return NextResponse.next();
    }

    // handle external api routes
    if (auth.isApiRoute) {
      if (req.headers.get('api-key') === process.env.EXTERNAL_ROUTE_API_KEY!) {
        return NextResponse.next();
      } else {
        return NextResponse.next({
          status: 400,
          statusText: 'Invalid API Key'
        });
      }
    }

    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL(`/sign-in`, req.url));
    }

    if (!auth.userId) {
      return NextResponse.rewrite(new URL(`/unauthorised`, req.url));
    }

    //if path not found, redirect to 404
    if (pathName.startsWith('/404')) {
      return NextResponse.next();
    }

    // return NextResponse.rewrite(new URL(`/`, req.url));
  },
  publicRoutes: [
    // these are the routes that are public
    '/',
    '/404',
    '/sign-in(.*)',
    '/unauthorised',
    '/api/webhook/clerk'
  ],
  ignoredRoutes: ['/api/trpc/[trpc]', 'api/webhook/clerk']
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
