import { Zap, MessageCircle, Globe2, Rocket, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Latest Gulf Opportunities",
    description: "Fresh jobs added daily from verified employers across all six Gulf countries.",
  },
  {
    icon: ShieldCheck,
    title: "Easy Job Search",
    description: "Powerful filters by location, category and experience help you find the right role fast.",
  },
  {
    icon: MessageCircle,
    title: "Direct Employer Contact",
    description: "Apply instantly via WhatsApp, email or a direct phone call - no lengthy forms.",
  },
  {
    icon: Globe2,
    title: "Multiple Gulf Countries",
    description: "One platform covering Saudi Arabia, UAE, Qatar, Kuwait, Bahrain and Oman.",
  },
  {
    icon: Rocket,
    title: "Fast & Simple Application",
    description: "A clean, mobile-friendly experience built for a quick, confident job search.",
  },
];

export function WhySection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">Why Gulf Job Hub?</h2>
          <p className="mt-3 text-slate-500">
            A trusted, professional platform built for job seekers across the Gulf region.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <f.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
