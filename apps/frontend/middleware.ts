import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("role")?.value;

  console.log(role);

  if (
    !token &&
    (pathname.startsWith("/pages/public/product") ||
      pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/pages/auth/login", req.url));
  }

  if (
    token &&
    (pathname === "/pages/auth/login" || pathname === "/pages/auth/register")
  ) {
    return NextResponse.redirect(new URL("/pages/public/product", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "admin") {

    return NextResponse.redirect(new URL("/pages/public/product", req.url));
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
