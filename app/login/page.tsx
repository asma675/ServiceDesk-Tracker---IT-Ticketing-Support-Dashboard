"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "Login failed");
      setLoading(false);
      return;
    }

    window.location.href = next;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-slate-600 mt-2">
          Use the seeded demo accounts, or create your own in the database.
        </p>

        <form className="mt-6 space-y-3" onSubmit={login}>
          <div>
            <label className="text-sm text-slate-700">Email</label>
            <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-slate-700">Password</label>
            <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button className="btn-primary w-full disabled:opacity-50" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-xs text-slate-600">
          <p><span className="font-medium">Admin:</span> admin@demo.com / Admin123!</p>
          <p><span className="font-medium">User:</span> user@demo.com / User123!</p>
        </div>
      </div>
    </main>
  );
}
