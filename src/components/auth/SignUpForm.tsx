"use client";

import { register } from "@/auth/sessions";
import React, { useActionState } from "react";

export default function SignUpForm() {
  const [state, formAction] = useActionState(register, {
    email: "",
    password: "",
    username: "",
  });

  return (
    <form action={formAction}>
      <label>
        Email
        <input type="email" defaultValue={state.email} name="email" />
      </label>
      <p className="text-xs text-red-500">{state.errors?.fieldErrors.email}</p>

      <label>
        Username
        <input type="username" defaultValue={state.username} name="username" />
      </label>
      <p className="text-xs text-red-500">
        {state.errors?.fieldErrors.username}
      </p>

      <label>
        Password
        <input type="password" defaultValue={state.password} name="password" />
      </label>
      <p className="text-xs text-red-500">
        {state.errors?.fieldErrors.password}
      </p>

      <input type="submit" value="Submit" />
    </form>
  );
}
