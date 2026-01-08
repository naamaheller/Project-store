import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./app/config/routes.config";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("role")?.value;

  const redirect = (path: string) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  if (
    !token &&
    (pathname.startsWith(ROUTES.public.products) ||
      pathname.startsWith(ROUTES.admin.root))
  ) {
    return redirect(ROUTES.auth.login);
  }

  if (
    token &&
    (pathname === ROUTES.auth.login || pathname === ROUTES.auth.register)
  ) {
    return redirect(ROUTES.public.products);
  }

  if (pathname.startsWith(ROUTES.admin.root) && role !== "admin") {
    return redirect(ROUTES.public.products);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pages/auth/login",
    "/pages/auth/register",
    "/pages/public/product/:path*",
    "/admin/:path*",
  ],
};
