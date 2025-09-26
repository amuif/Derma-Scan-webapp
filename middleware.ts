import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/home",
  "/profile",
  "/clinics",
  "/scan",
  "/community",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/profile/:path*",
    "/clinics/:path*",
    "/scan/:path*",
    "/community/:path*",
  ],
};
