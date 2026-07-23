"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-xl -translate-x-1/2 rounded-full bg-blue-900/10 blur-3xl"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-lg font-semibold text-white shadow-sm">
            A
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Airchat</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Citizens Intelligence Platform
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-md shadow-neutral-200/50"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Staff access only. Contact an administrator for credentials.
        </p>
      </div>
    </div>
  );
}
