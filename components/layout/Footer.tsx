"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="footer-glow relative overflow-hidden text-[#fafafa]">
      <div className="container-x section relative">
        <div className="grid gap-[var(--vw-6)] md:grid-cols-12">
          {/* Newsletter / pitch */}
          <div className="md:col-span-5">
            <Eyebrow className="!text-white/60">Stay in the light</Eyebrow>
            <p className="mt-6 font-display text-[length:var(--text-3xl)] font-light leading-tight text-balance text-[#fafafa]">
              Occasional notes on craft, product, and the web — no noise.
            </p>
            <form
              className="mt-8 flex max-w-md items-center gap-3 border-b border-white/20 pb-3 focus-within:border-accent"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setDone(true);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                className="w-full bg-transparent text-[#fafafa] outline-none placeholder:text-white/40"
                aria-label="Email address"
              />
              <button
                type="submit"
                data-cursor
                className="shrink-0 label-caps !text-[#fafafa] transition-colors hover:!text-accent"
              >
                {done ? "Joined ✓" : "Join →"}
              </button>
            </form>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <FooterCol title="Pages">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-cursor
                  className="w-fit text-[length:var(--text-lg)] text-white/60 transition-colors hover:text-[#fafafa]"
                >
                  {item.label}
                </Link>
              ))}
            </FooterCol>
          </div>

          <div className="md:col-span-2">
            <FooterCol title="Social">
              {site.socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                  className="w-fit text-[length:var(--text-lg)] text-white/60 transition-colors hover:text-[#fafafa]"
                >
                  {s.label}
                </a>
              ))}
            </FooterCol>
          </div>

          <div className="md:col-span-2">
            <FooterCol title="Contact">
              <a
                href={`mailto:${site.email}`}
                data-cursor
                className="w-fit text-[length:var(--text-lg)] text-white/60 transition-colors hover:text-[#fafafa]"
              >
                {site.email}
              </a>
              <span className="text-[length:var(--text-lg)] text-white/40">{site.locale}</span>
            </FooterCol>
          </div>
        </div>

        {/* Monumental wordmark */}
        <div className="mt-[var(--vw-8)] select-none">
          <span className="block bg-gradient-to-b from-white/85 to-white/5 bg-clip-text font-display leading-[0.8] tracking-tight text-transparent [font-size:clamp(5rem,22vw,20rem)]">
            Lumako<span className="text-accent/60">.</span>
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 label-caps !text-white/40 md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {site.name} — Built in the light.
          </span>
          <span>{site.tagline}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="label-caps !text-white/50">{title}</span>
      <div className={cn("mt-5 flex flex-col gap-3 text-[length:var(--text-lg)]")}>
        {children}
      </div>
    </div>
  );
}
