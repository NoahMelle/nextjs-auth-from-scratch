"use server";

import { db } from "@/db";
import { sessionsTable } from "@/db/schemas";
import { and, eq, gte } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function generateSessionToken(): Promise<string> {
  return crypto.randomBytes(64).toString("hex");
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const session = await db.query.sessionsTable.findFirst({
    where: eq(sessionsTable.sessionId, token),
    with: {
      user: {
        columns: {
          email: true,
          username: true,
        },
      },
    },
  });

  return !!session;
}

export async function getServerSession(cookieStore: ReadonlyRequestCookies) {
  const token = cookieStore.get("session_id");

  if (!token?.value) {
    redirect("/login");
  }

  const session = await db.query.sessionsTable.findFirst({
    where: and(
      eq(sessionsTable.sessionId, token?.value),
      gte(sessionsTable.expiresAt, new Date()),
      eq(sessionsTable.valid, true)
    ),
    with: {
      user: {
        columns: {
          email: true,
          username: true,
        },
      },
    },
  });

  if (!session) {
    redirect("/api/signout");
  }

  return session;
}

export async function generateUserSession(userId: number): Promise<string> {
  const token = await generateSessionToken();

  await db.insert(sessionsTable).values({
    sessionId: token,
    userId,
  });

  return token;
}

export async function invalidateSession(withRedirect = false) {
  try {
    const cookieStore = await cookies();

    const sessionId = cookieStore.get("session_id");

    if (sessionId) {
      await db
        .update(sessionsTable)
        .set({
          valid: false,
        })
        .where(eq(sessionsTable.sessionId, sessionId.value));
    }

    cookieStore.delete("session_id");
  } finally {
    if (withRedirect) {
      return redirect("/login");
    }
  }
}
