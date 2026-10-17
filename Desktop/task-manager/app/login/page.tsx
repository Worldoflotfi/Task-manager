
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
        });

        if (error) {
          setMessage(error.message ?? "Could not create your account.");
          return;
        }

        setMessage("Account created! You can now sign in.");
        setIsSignUp(false);
        setPassword("");
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) {
          setMessage(error.message ?? "Could not sign in.");
          return;
        }

        router.push("/");
        router.refresh();
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function switchMode() {
    setIsSignUp((current) => !current);
    setMessage("");
    setPassword("");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4 py-12 text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Subtle indigo ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-violet-400/15 blur-3xl"
      />

      <section className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 transition duration-300 hover:scale-105 hover:shadow-indigo-500/40">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
            >
              <path
                d="m5 12.5 4.2 4.2L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your productivity{" "}
            <span className="text-indigo-600">space.</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {isSignUp
              ? "Create your account and make room for what matters."
              : "Your goals, your tasks, your next big thing."}
          </p>
        </div>

        {/* Authentication card */}
        <div className="rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_20px_70px_-25px_rgba(79,70,229,0.22)] backdrop-blur-xl sm:p-8">
          {/* Mode switch */}
          <div className="mb-7 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => {
                if (isSignUp) switchMode();
              }}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                !isSignUp
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isSignUp) switchMode();
              }}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isSignUp
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Create account
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight">
              {isSignUp ? "Get started" : "Welcome back"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isSignUp
                ? "Fill in your details to join."
                : "Enter your details to continue."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder={
                  isSignUp ? "At least 8 characters" : "Enter your password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {message && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm leading-5 text-indigo-800"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />

              <span className="relative">
                {isLoading
                  ? isSignUp
                    ? "Creating account..."
                    : "Signing in..."
                  : isSignUp
                    ? "Create account"
                    : "Sign in"}
              </span>

              {!isLoading && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-gray-400">
            {isSignUp
              ? "By creating an account, you can keep your tasks organized in one place."
              : "Your productivity journey continues here."}
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Built for focus. Designed for progress.
        </p>
      </section>
    </main>
  );
}
