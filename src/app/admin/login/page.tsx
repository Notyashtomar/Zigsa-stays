"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: searchParams.get("callbackUrl") || "/admin",
    });
    if (result?.error) {
      setError("Those staff details did not match.");
      setBusy(false);
      return;
    }
    window.location.href = result?.url || "/admin";
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Email</span>
        <input className="field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-500">Password</span>
        <input className="field" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      </label>
      {error ? <p className="text-sm text-wood-700">{error}</p> : null}
      <button type="submit" className="btn-primary w-full" disabled={busy}>
        {busy ? "Signing in…" : "Enter the desk"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-wood-300/70 bg-cream-50 p-8 shadow-lg">
        <Logo size={72} showWordmark />
        <h1 className="font-display mt-6 text-3xl text-forest-900">Staff login</h1>
        <p className="mt-2 text-sm text-ink-600">Password-protected desk for rooms, rates, blocks, and bookings.</p>
        <Suspense fallback={<p className="mt-8 text-sm">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
