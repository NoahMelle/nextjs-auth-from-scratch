import { getServerSession } from "@/auth/sessions";
import SignOutButton from "@/components/auth/SignOutButton";
import { cookies } from "next/headers";
import React from "react";

export default async function Protected() {
  const cookieStore = await cookies();

  const { user } = await getServerSession(cookieStore);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <main className="w-full max-w-[800px]">
        <h1>Protected Page</h1>
        <p>
          <span className="font-semibold">Username: </span>
          {user.username}
        </p>
        <p>
          <span className="font-semibold">Email: </span>
          {user.email}
        </p>
        <SignOutButton />
      </main>
    </div>
  );
}
