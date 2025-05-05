"use server";

import { db } from "@/db";
import { sessionsTable, usersTable } from "@/db/schemas";
import { registerSchema, signinSchema } from "@/lib/schemas";
import bcrypt from "bcrypt";
import { and, eq, gte } from "drizzle-orm";
import { cookies } from "next/headers";
import { LoginFormStateType, SignUpFormStateType } from "./types";
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

export async function login(
  prevState: LoginFormStateType,
  formData: FormData
): Promise<LoginFormStateType> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  signinSchema.parse({ email, password });

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });

  if (!user || !bcrypt.compare(password, user.password)) {
    return {
      ...prevState,
      errors: {
        formErrors: ["Email or password is incorrect"],
        fieldErrors: {},
      },
    };
  }

  const sessionId = await generateUserSession(user.id);

  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId);

  redirect("/protected");
}

export async function register(
  _: SignUpFormStateType,
  formData: FormData
): Promise<SignUpFormStateType> {
  // TODO: check for already existing email/username

  const password = formData.get("password") as string;
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;

  const parseRes = registerSchema.safeParse({
    password,
    email,
    username,
  });

  if (!parseRes.success) {
    return {
      username,
      password,
      email,
      errors: parseRes.error.flatten(),
    };
  }

  const cookieStore = await cookies();

  const hashedPassword = await bcrypt.hash(password, 10);

  const [{ id }] = await db
    .insert(usersTable)
    .values({
      email,
      password: hashedPassword,
      username,
    })
    .$returningId();

  const sessionId = await generateUserSession(id);

  cookieStore.set("session_id", sessionId);

  return {
    username,
    password,
    email,
    errors: undefined,
  };
}

export async function invalidateSession(withRedirect = false) {
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

  if (withRedirect) {
    redirect("/login");
  }
}
