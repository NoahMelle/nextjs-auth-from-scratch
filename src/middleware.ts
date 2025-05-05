import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./auth/ironSession";

const guestPaths = ["/login", "/register"];
const protectedPaths = ["/protected"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { sessionId } = session;

  if (
    guestPaths.some((guestPath) =>
      request.nextUrl.pathname.startsWith(guestPath)
    ) &&
    sessionId
  ) {
    return NextResponse.redirect(new URL("/protected", request.url));
  }

  if (
    protectedPaths.some((protectedPath) =>
      request.nextUrl.pathname.startsWith(protectedPath)
    ) &&
    !sessionId
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/protected"],
};
