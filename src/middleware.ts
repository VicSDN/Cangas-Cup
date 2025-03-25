import { defineMiddleware } from "astro:middleware";
import type { APIRoute } from "astro";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const isAdminRoute = url.pathname.startsWith("/admin/");
  const isSigninPage = url.pathname === "/admin/signin";

  if (isAdminRoute && !isSigninPage) {
    const token = context.cookies.get("sb-access-token")?.value;

    if (!token) {
      return context.redirect("/admin/signin");
    }
  }

  return next();
}); 