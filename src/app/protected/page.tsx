import { getServerSession } from "@/auth/sessions";
import React from "react";

export default async function Protected() {
  const session = await getServerSession();

  console.log(session);

  return <div>Protected</div>;
}
