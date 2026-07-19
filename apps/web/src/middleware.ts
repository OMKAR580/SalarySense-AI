import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Protect /predict paths from unauthenticated access
  if (pathname.startsWith("/predict") && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users trying to access login page to dashboard
  if (pathname.startsWith("/login") && token) {
    const dashboardUrl = new URL("/predict", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Config to specify matching route paths
export const config = {
  matcher: ["/predict/:path*", "/login"],
};
