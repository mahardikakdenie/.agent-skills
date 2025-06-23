import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { LOGIN, DASHBOARD_TRANSACTION } from "@/constants/routes";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/protected");
  const isLoginPage = pathname === LOGIN;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(LOGIN, request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL(DASHBOARD_TRANSACTION, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*", "/"],
}

