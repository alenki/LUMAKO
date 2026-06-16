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
    <footer className="relative overflow-hidden border-t border-line bg-bg">
      <div className="container-x section">
        <div className="grid gap-[var(--vw-6)] md:grid-cols-12">
          {/* Newsletter / pitch */}
          <div className="md:col-span-5">
            <Eyebrow>Stay in the light</Eyebrow>
            <p className="mt-6 font-display text-[length:var(--text-3xl)] font-light leading-tight text-balance">
              Occasional notes on craft, product, and the web — no noise.
            </p>
            <form
              className="mt-8 flex max-w-md items-center gap-3 border-b border-line pb-3 focus-within:border-accent"
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
                className="w-full bg-transparent text-fg outline-none placeholder:text-fg-dim"
                aria-label="Email address"
              />
              <button
                type="submit"
                data-cursor
                className="shrink-0 font-mono text-[length:var(--text-mono)] uppercase tracking-widest text-fg transition-colors hover:text-accent"
              >
                {done ? "Joined ✓" : "Join →"}
              </button>
            </form>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <FooterCol title="Pages">
              {site.nav.map((item) => (
                <Link key={item.href} href={item.href} data-cursor className="footer-link">
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
                  className="footer-link"
                >
                  {s.label}
                </a>
              ))}
            </FooterCol>
          </div>

          <div className="md:col-span-2">
            <FooterCol title="Contact">
              <a href={`mailto:${site.email}`} data-cursor className="footer-link">
                {site.email}
              </a>
              <span className="text-fg-dim">{site.locale}</span>
            </FooterCol>
          </div>
        </div>

        {/* Monumental wordmark */}
        <div className="mt-[var(--vw-8)] select-none">
          <span className="block bg-gradient-to-b from-fg/85 to-fg/5 bg-clip-text font-display lowercase leading-[0.8] tracking-tight text-transparent [font-size:clamp(5rem,22vw,20rem)]">
            lumako<span className="text-accent/30">.</span>
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[length:var(--text-mono)] uppercase tracking-[0.18em] text-fg-dim md:flex-row md:items-center md:justify-between">
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
      <span className="font-mono text-[length:var(--text-mono)] uppercase tracking-[0.2em] text-fg-dim">
        {title}
      </span>
      <div className={cn("mt-5 flex flex-col gap-3 text-[length:var(--text-lg)]")}>
        {children}
      </div>
    </div>
  );
}
