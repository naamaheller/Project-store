import { NextRequest, NextResponse } from "next/server";

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
    (pathname.startsWith("/pages/public/product") ||
      pathname.startsWith("/admin"))
  ) {
    return redirect("/pages/auth/login");
  }

  if (
    token &&
    (pathname === "/pages/auth/login" || pathname === "/pages/auth/register")
  ) {
    return redirect("/pages/public/product");
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return redirect("/pages/public/product");
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
