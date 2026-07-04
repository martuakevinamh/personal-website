import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side middleware — runs BEFORE any page is rendered.
 * Protects all /admin/* routes (except /admin/login) by verifying
 * the Supabase session cookie. This is the only secure way to guard
 * admin pages in Next.js App Router.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page through — everything else under /admin is protected
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Read the Supabase session from cookies (set by Supabase Auth)
  const accessToken = request.cookies.get("sb-access-token")?.value
    ?? request.cookies.get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}-auth-token`)?.value;

  if (!accessToken) {
    // No session cookie → redirect to login immediately (server-side, no JS flicker)
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Verify the token is valid against Supabase
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.getUser(accessToken);
    if (error) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
