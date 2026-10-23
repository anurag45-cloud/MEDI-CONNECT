import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip public static assets and API routes that handle their own auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Allow public portal login & registration endpoints
  const isPublicAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/doctor/login" ||
    pathname === "/doctor/register" ||
    pathname === "/hospital/login" ||
    pathname === "/hospital/register" ||
    pathname === "/admin/login";

  if (isPublicAuthRoute) {
    return NextResponse.next();
  }

  // 3. In demo / local mode or Supabase mode, allow access to dashboards and pages
  // while individual page server components strictly enforce role authorizations.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
