export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/list-property/:path*",
    "/payment/:path*",
  ],
};
