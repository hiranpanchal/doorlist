import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check all possible NextAuth/Auth.js session cookie names
  const cookieNames = [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
  ];

  const hasSession = cookieNames.some(
    (name) => request.cookies.get(name)?.value
  );

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/list-property") ||
    pathname.startsWith("/payment");

  const isAdmin = pathname.startsWith("/admin");

  if ((isProtected || isAdmin) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/list-property/:path*",
    "/payment/:path*",
  ],
};
