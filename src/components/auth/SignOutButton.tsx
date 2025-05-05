"use client";

import { invalidateSession } from "@/auth/sessions";
import React from "react";

export default function SignOutButton() {
  return (
    <button
      className="bg-red-400 hover:bg-red-500 transition-colors cursor-pointer text-white py-1 px-2 rounded-sm text-sm font-semibold"
      onClick={() => invalidateSession(true)}
    >
      Sign Out
    </button>
  );
}
