import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  
  // Solo proteger rutas que empiecen con /admin/
  if (url.pathname.startsWith("/admin/")) {
    // Excluir la página de login
    if (url.pathname === "/admin/signin") {
      return next();
    }

    // Obtener el token de la cookie
    const token = context.request.headers.get("cookie")?.split("sb-access-token=")[1]?.split(";")[0];

    if (!token) {
      return context.redirect("/admin/signin");
    }
  }

  return next();
}); 