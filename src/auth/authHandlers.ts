"use server";

import { registerSchema, signinSchema } from "@/lib/schemas";
import { LoginFormStateType, SignUpFormStateType } from "./types";
import { db } from "@/db";
import { eq, or } from "drizzle-orm";
import { usersTable } from "@/db/schemas";
import { generateUserSession } from "./sessions";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function login(
  _: LoginFormStateType,
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
      email,
      password,
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
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;

  const parseRes = registerSchema.safeParse({
    password,
    email,
    username,
  });

  const existingUsers = await db.query.usersTable.findMany({
    where: or(eq(usersTable.email, email), eq(usersTable.username, username)),
    columns: {
      username: true,
      email: true,
    },
  });

  if (!parseRes.success || existingUsers.length >= 1) {
    return {
      username,
      password,
      email,
      errors: !parseRes.success
        ? parseRes.error.flatten()
        : {
            fieldErrors: {
              email: existingUsers.some((user) => user.email === email)
                ? ["The email is already taken"]
                : undefined,
              username: existingUsers.some((user) => user.username === username)
                ? ["The username is already taken"]
                : undefined,
            },
            formErrors: [],
          },
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
