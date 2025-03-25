import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  
  if (url.pathname.startsWith("/admin/")) {
    if (url.pathname === "/admin/signin") {
      return next();
    }

    const token = context.request.headers.get("cookie")?.split("sb-access-token=")[1]?.split(";")[0];

    if (!token) {
      return context.redirect("/admin/signin");
    }
  }

  return next();
}); 