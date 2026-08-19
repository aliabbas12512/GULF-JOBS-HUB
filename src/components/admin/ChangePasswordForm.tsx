"use client";

import { useState } from "react";
import { Label, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = new FormData(e.currentTarget);
    const newPassword = String(form.get("newPassword") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: form.get("currentPassword"),
        newPassword,
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not update password.");
      return;
    }

    setSuccess(true);
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-5">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Password updated successfully.
        </div>
      )}

      <div>
        <Label htmlFor="currentPassword" required>
          Current Password
        </Label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </div>
      <div>
        <Label htmlFor="newPassword" required>
          New Password
        </Label>
        <Input id="newPassword" name="newPassword" type="password" minLength={8} required />
      </div>
      <div>
        <Label htmlFor="confirmPassword" required>
          Confirm New Password
        </Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" minLength={8} required />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
