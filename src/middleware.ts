import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async (context: {request: Request}, next: () => Promise<Response>) => {
  const url = new URL(context.request.url);
  const isAdminRoute = url.pathname.startsWith('/admin/');
  const isSigninPage = url.pathname === '/admin/signin';
  if (isAdminRoute && !isSigninPage) {
    const token = context.request.headers.get('cookie')?.match(/sb-access-token=([^;]+)/)?.[1];

    if (!token) {
      return new Response('', {
        status: 302,
        headers: {
          'Location': '/admin/signin'
        }
      });
    }
  }

  return next();
});
