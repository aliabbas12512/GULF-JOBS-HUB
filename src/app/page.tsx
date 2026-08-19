import { Hero } from "@/components/home/Hero";
import { WhySection } from "@/components/home/WhySection";
import { JobCard } from "@/components/jobs/JobCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { Button } from "@/components/ui/Button";
import { getLatestPublishedJobs } from "@/lib/db/jobs";
import { getSiteSettings, getAdSlots } from "@/lib/db/settings";

export default async function HomePage() {
  const [jobs, settings] = await Promise.all([getLatestPublishedJobs(9), getSiteSettings()]);
  const adSlots = getAdSlots(settings);

  return (
    <>
      <Hero />

      <section className="container-page py-4">
        <AdSlot enabled={adSlots.homepage_enabled} code={adSlots.homepage_code} label="Homepage" />
      </section>

      <section className="py-14 sm:py-16">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">Latest Jobs</h2>
              <p className="mt-2 text-sm text-slate-500">
                Newly published opportunities across the Gulf region.
              </p>
            </div>
            <Button href="/jobs" variant="outline">
              View All Jobs
            </Button>
          </div>

          {jobs.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-slate-500">
              No jobs published yet. Check back soon, or explore the admin dashboard to add the
              first listing.
            </p>
          )}

          <div className="mt-10 flex justify-center">
            <Button href="/jobs" size="lg">
              View All Jobs
            </Button>
          </div>
        </div>
      </section>

      <WhySection />
    </>
  );
}
