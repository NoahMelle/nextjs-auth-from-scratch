"use server";

import { db } from "@/db";
import { sessionsTable, usersTable } from "@/db/schemas";
import { registerSchema, signinSchema } from "@/lib/schemas";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { LoginFormStateType, SignUpFormStateType } from "./types";
import { redirect } from "next/navigation";
import crypto from "crypto";

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
  const cookieStore = await cookies();

  const token = cookieStore.get("session_id");

  console.log(token);

  if (!token?.value) {
    console.log("no token found");

    redirect("/login");
  }

  const session = await db.query.sessionsTable.findFirst({
    where: eq(sessionsTable.sessionId, token?.value),
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
    redirect("/login");
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
  prevState: SignUpFormStateType,
  formData: FormData
): Promise<SignUpFormStateType> {
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;
  const username = formData.get("email") as string;

  const parseRes = registerSchema.safeParse({
    password,
    email,
    username,
  });

  if (!parseRes.success) {
    return {
      ...prevState,
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
    ...prevState,
    errors: undefined,
  };
}
