import { getServerSession } from "@/auth/sessions";
import { cookies } from "next/headers";
import Link from "next/link";
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
        <Link
          className={`bg-red-400 hover:bg-red-500 transition-colors cursor-pointer text-white py-1 px-2 rounded-sm text-sm font-semibold block w-fit`}
          href={"/api/signout"}
        >
          Sign Out
        </Link>
      </main>
    </div>
  );
}
