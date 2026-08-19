import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <SearchX className="h-8 w-8 text-slate-400" aria-hidden />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-navy-900">Page Not Found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button href="/">Back to Home</Button>
        <Button href="/jobs" variant="outline">
          Browse Jobs
        </Button>
      </div>
    </div>
  );
}
