import Link from "next/link";
import { getLeadEvents } from "@/lib/db/analytics";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/jobs/Pagination";
import { formatDate } from "@/lib/utils/format";

export const metadata = { title: "Applications / Leads" };

const EVENT_LABELS: Record<string, string> = {
  apply_click: "Apply Click",
  whatsapp_click: "WhatsApp",
  email_click: "Email",
  call_click: "Call",
};

const EVENT_TONE: Record<string, "success" | "brand" | "gold" | "neutral"> = {
  apply_click: "brand",
  whatsapp_click: "success",
  email_click: "brand",
  call_click: "gold",
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const pageSize = 30;
  const { events, total } = await getLeadEvents(pageSize, (page - 1) * pageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications / Leads</h1>
        <p className="mt-1 text-sm text-slate-500">
          {total} application clicks recorded (WhatsApp, Email and Call).
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event) => {
              const job = Array.isArray(event.job) ? event.job[0] : event.job;
              return (
                <tr key={event.id}>
                  <td className="px-4 py-3">
                    {job ? (
                      <Link href={`/jobs/${job.slug}`} target="_blank" className="font-medium text-brand-600 hover:underline">
                        {job.title}
                      </Link>
                    ) : (
                      <span className="text-slate-400">Job removed</span>
                    )}
                    {job?.reference && <p className="text-xs text-slate-400">{job.reference}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={EVENT_TONE[event.event_type] ?? "neutral"}>
                      {EVENT_LABELS[event.event_type] ?? event.event_type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {formatDate(event.created_at)}
                  </td>
                </tr>
              );
            })}
            {events.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-slate-400">
                  No applications recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination basePath="/admin/leads" searchParams={{}} page={page} totalPages={totalPages} />
    </div>
  );
}
