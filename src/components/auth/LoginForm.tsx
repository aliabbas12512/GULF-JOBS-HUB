"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function LoginForm({
  endpoint,
  redirectTo,
}: {
  endpoint: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password" required>
            Password
          </Label>
        </div>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="inline-flex items-center gap-2 text-slate-600">
          <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Remember me
        </label>
        <a href="/forgot-password" className="font-medium text-brand-600 hover:text-brand-700">
          Forgot Password?
        </a>
      </div>

      <Button type="submit" fullWidth size="lg" disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
