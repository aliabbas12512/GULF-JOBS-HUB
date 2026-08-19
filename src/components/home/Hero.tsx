import { SearchBox } from "./SearchBox";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(29,99,216,0.35), transparent 45%), radial-gradient(circle at 85% 0%, rgba(201,146,43,0.25), transparent 40%)",
        }}
        aria-hidden
      />
      <div className="container-page relative py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-gold-400">
            Saudi Arabia &middot; UAE &middot; Qatar &middot; Kuwait &middot; Bahrain &middot; Oman
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Find Your Next Career in the Gulf
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Discover the latest jobs across Saudi Arabia, UAE, Qatar, Kuwait, Bahrain and Oman.
          </p>
        </div>

        <div className="mt-10">
          <SearchBox />
        </div>
      </div>
    </section>
  );
}
