import Link from "next/link";
import { Briefcase, CheckCircle2, FileEdit, XCircle, CalendarClock, MousePointerClick } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { getDashboardStats } from "@/lib/db/jobs";
import { getMostViewedJobs, getTopSearchQueries } from "@/lib/db/analytics";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [stats, mostViewed, topSearches] = await Promise.all([
    getDashboardStats(),
    getMostViewedJobs(5),
    getTopSearchQueries(5),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of jobs and activity on Gulf Job Hub.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Jobs" value={stats.totalJobs} icon={Briefcase} tone="brand" />
        <StatCard label="Published" value={stats.publishedJobs} icon={CheckCircle2} tone="success" />
        <StatCard label="Draft" value={stats.draftJobs} icon={FileEdit} tone="warning" />
        <StatCard label="Expired" value={stats.expiredJobs} icon={XCircle} tone="danger" />
        <StatCard label="Posted Today" value={stats.jobsPostedToday} icon={CalendarClock} tone="gold" />
        <StatCard label="Total Clicks" value={stats.totalEvents} icon={MousePointerClick} tone="brand" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">Most Viewed Jobs</h2>
          <div className="mt-4 space-y-1">
            {mostViewed.length === 0 && <p className="text-sm text-slate-400">No data yet.</p>}
            {mostViewed.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                target="_blank"
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50"
              >
                <span className="truncate text-slate-700">{job.title}</span>
                <span className="ml-3 shrink-0 text-xs font-medium text-slate-400">
                  {job.views_count} views
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">Most Searched Keywords</h2>
          <div className="mt-4 space-y-1">
            {topSearches.length === 0 && <p className="text-sm text-slate-400">No searches logged yet.</p>}
            {topSearches.map((s) => (
              <div key={s.query} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm">
                <span className="truncate text-slate-700">{s.query}</span>
                <span className="ml-3 shrink-0 text-xs font-medium text-slate-400">{s.count}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/jobs/new"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Add New Job
        </Link>
        <Link
          href="/admin/bulk-upload"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-300"
        >
          Bulk Upload Jobs
        </Link>
      </div>
    </div>
  );
}
