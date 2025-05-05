"use server";

import { db } from "@/db";
import { sessionsTable } from "@/db/schemas";
import { and, eq, gte } from "drizzle-orm";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { getSession } from "./ironSession";

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

export async function getServerSession() {
  const { sessionId } = await getSession();

  if (!sessionId) {
    redirect("/login");
  }

  const session = await db.query.sessionsTable.findFirst({
    where: and(
      eq(sessionsTable.sessionId, sessionId),
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

  return session.user;
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
    const session = await getSession();

    if (session.sessionId) {
      await db
        .update(sessionsTable)
        .set({
          valid: false,
        })
        .where(eq(sessionsTable.sessionId, session.sessionId));
    }

    session.destroy();
  } finally {
    if (withRedirect) {
      return redirect("/login");
    }
  }
}
