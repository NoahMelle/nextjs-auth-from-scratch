import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const guestPaths = ["/login", "/register"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();

  if (
    guestPaths.some((guestPath) =>
      request.nextUrl.pathname.startsWith(guestPath)
    ) &&
    cookieStore.get("session_id")
  ) {
    return NextResponse.redirect(new URL("/protected", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/register"],
};
