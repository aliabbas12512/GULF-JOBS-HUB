import type { JobWithRelations } from "@/types";
import { ApplyButtons } from "./ApplyButtons";

export function StickyApplyBar({ job }: { job: JobWithRelations }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_12px_rgba(16,24,40,0.08)] backdrop-blur sm:hidden">
      <ApplyButtons job={job} variant="compact" />
    </div>
  );
}
