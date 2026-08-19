"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
        <AlertTriangle className="h-8 w-8 text-rose-500" aria-hidden />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-navy-900">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        We hit an unexpected error. Please try again, or head back to the homepage.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try Again</Button>
        <Button href="/" variant="outline">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
