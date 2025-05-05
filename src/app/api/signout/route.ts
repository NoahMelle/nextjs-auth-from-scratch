import { invalidateSession } from "@/auth/sessions";
import { env } from "@/env";
import { NextResponse } from "next/server";

export async function GET() {
  await invalidateSession();

  return NextResponse.redirect(`${env.BASE_URL}/login`);
}
