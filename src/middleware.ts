import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: CookieOptions;
          }[]
        ) {
          // Set cookies on request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // Create new response with updated request
          supabaseResponse = NextResponse.next({
            request,
          });

          // Set cookies on response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 🔐 Get current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🚫 Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // OPTIONAL: If you enforce is_admin via DB later
    // you can fetch customer here and check role
  }

  return supabaseResponse;
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/admin/:path*"],
};
