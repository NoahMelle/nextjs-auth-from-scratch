"use client";

import { login } from "@/auth/sessions";
import React, { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, {
    email: "",
    password: "",
  });

  return (
    <form action={formAction}>
      <label>
        Email
        <input type="email" defaultValue={state.email} name="email" />
      </label>
      <p>{state.errors?.fieldErrors.email}</p>

      <label>
        Password
        <input type="password" defaultValue={state.password} name="password" />
      </label>
      <p>{state.errors?.fieldErrors.password}</p>

      <input type="submit" value="Submit" />
    </form>
  );
}
