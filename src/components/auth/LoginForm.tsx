"use client";

import { login } from "@/auth/sessions";
import Link from "next/link";
import React, { useActionState } from "react";
import FormInput from "../reusable/FormInput";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {
    email: "",
    password: "",
  });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="font-bold text-xl text-center">Sign in</h1>

      <FormInput
        type="email"
        defaultValue={state.email}
        name="email"
        placeholder="hello@example.com"
        label="Email"
        errors={state.errors?.fieldErrors.email}
      />

      <FormInput
        label="Password"
        errors={state.errors?.fieldErrors.password}
        type="password"
        defaultValue={state.password}
        name="password"
      />

      <input
        type="submit"
        value={pending ? "Loading..." : "Log in"}
        disabled={pending}
        className={`${
          pending ? "bg-slate-400" : "bg-slate-700 hover:bg-slate-800"
        } text-white w-full rounded-sm py-2 text-sm transition-colors`}
      />
      <p className="text-sm text-center">
        No account yet? Register{" "}
        <Link href={"/register"} className="text-blue-600">
          here
        </Link>
      </p>
    </form>
  );
}
