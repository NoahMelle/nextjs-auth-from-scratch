"use client";

import { register } from "@/auth/sessions";
import React, { useActionState } from "react";
import FormInput from "../reusable/FormInput";
import Link from "next/link";

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(register, {
    email: "",
    password: "",
    username: "",
  });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="font-bold text-xl text-center">Sign Up</h1>

      <FormInput
        type="email"
        label="Email"
        defaultValue={state.email}
        name="email"
        errors={state.errors?.fieldErrors.email}
      />

      <FormInput
        label="Username"
        errors={state.errors?.fieldErrors.username}
        type="text"
        defaultValue={state.username}
        name="username"
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
        Already have an account? Sign in{" "}
        <Link href={"/login"} className="text-blue-600">
          here
        </Link>
      </p>
    </form>
  );
}
