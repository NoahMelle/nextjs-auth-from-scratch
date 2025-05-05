import { env } from "@/env";
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

interface SessionData {
  sessionId?: string;
}

export const sessionOptions: SessionOptions = {
  password: env.SESSION_SECRET,
  cookieName: "session_id",
  cookieOptions: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
  },
};

export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  return session;
}
