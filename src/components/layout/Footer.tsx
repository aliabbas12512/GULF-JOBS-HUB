import Link from "next/link";
import { Compass } from "lucide-react";
import { getSiteSettings, getSocialLinks } from "@/lib/db/settings";
import { getCountries } from "@/lib/db/reference-data";

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 11.94 2 6.37 2 1.9 6.5 1.9 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.44V9.97c0-2.41 1.44-3.75 3.64-3.75 1.05 0 2.15.19 2.15.19v2.37h-1.21c-1.2 0-1.57.74-1.57 1.5v1.8h2.67l-.43 2.9h-2.24v7.03c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}
function TwitterGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M18.24 3H21l-6.35 7.26L22.2 21h-6.15l-4.81-6.3L5.7 21H2.92l6.8-7.77L2 3h6.3l4.35 5.76L18.24 3zm-1.08 16.17h1.7L7.9 4.73H6.08l11.08 14.44z" />
    </svg>
  );
}
function LinkedinGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M6.94 5a2 2 0 11-4-.002 2 2 0 014 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48z" />
    </svg>
  );
}
function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M12 2c2.71 0 3.05.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.07.06 1.41.06 4.13s-.01 3.05-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 01-1.15 1.76 4.9 4.9 0 01-1.76 1.15c-.64.25-1.37.42-2.43.47-1.07.05-1.41.06-4.12.06s-3.06-.01-4.13-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 01-1.76-1.15 4.9 4.9 0 01-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.05 2 14.71 2 12s.01-3.06.06-4.13c.05-1.06.22-1.79.47-2.43.26-.66.6-1.26 1.15-1.76a4.9 4.9 0 011.76-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.29 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-8.4a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" />
    </svg>
  );
}

export async function Footer() {
  const settings = await getSiteSettings();
  const social = getSocialLinks(settings);
  const countries = await getCountries();

  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-navy-950 text-slate-300">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-gold-400">
              <Compass className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg font-bold text-white">{settings.site_name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            Find your next career opportunity across the Gulf. New jobs added daily across Saudi
            Arabia, UAE, Qatar, Kuwait, Bahrain and Oman.
          </p>
          {(social.facebook || social.twitter || social.linkedin || social.instagram) && (
            <div className="mt-5 flex items-center gap-3">
              {social.facebook && (
                <SocialLink href={social.facebook} label="Facebook">
                  <FacebookGlyph />
                </SocialLink>
              )}
              {social.twitter && (
                <SocialLink href={social.twitter} label="Twitter">
                  <TwitterGlyph />
                </SocialLink>
              )}
              {social.linkedin && (
                <SocialLink href={social.linkedin} label="LinkedIn">
                  <LinkedinGlyph />
                </SocialLink>
              )}
              {social.instagram && (
                <SocialLink href={social.instagram} label="Instagram">
                  <InstagramGlyph />
                </SocialLink>
              )}
            </div>
          )}
        </div>

        <FooterCol title="Explore">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/jobs">Jobs</FooterLink>
          <FooterLink href="/categories">Categories</FooterLink>
          <FooterLink href="/locations">Locations</FooterLink>
        </FooterCol>

        <FooterCol title="Locations">
          {countries.slice(0, 6).map((c) => (
            <FooterLink key={c.id} href={`/locations/${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Company">
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
          <FooterLink href="/terms">Terms &amp; Conditions</FooterLink>
          <FooterLink href="/cookie-policy">Cookie Policy</FooterLink>
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; {year} {settings.site_name}. All rights reserved.
          </p>
          <p>Built for careers across the Gulf.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className="mt-4 flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-slate-400 hover:text-white">
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
    >
      {children}
    </a>
  );
}
