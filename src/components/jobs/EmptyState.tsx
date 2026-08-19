import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  title = "No jobs found matching your search.",
  description = "Try adjusting your filters or search with different keywords.",
  clearHref,
}: {
  title?: string;
  description?: string;
  clearHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <SearchX className="h-7 w-7 text-slate-400" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>
      {clearHref && (
        <Button href={clearHref} variant="outline" size="sm" className="mt-5">
          Clear Filters
        </Button>
      )}
    </div>
  );
}
