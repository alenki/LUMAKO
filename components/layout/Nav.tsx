"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/content/site";
import { Logo } from "@/components/ui/Logo";
import { LanguageToggle, type Locale } from "@/components/ui/LanguageToggle";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";
import { useScrolled } from "@/lib/mediaHooks";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");
  const scrolled = useScrolled(24);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[200] transition-colors duration-500",
          scrolled || open
            ? "bg-bg/70 backdrop-blur-xl"
            : "bg-gradient-to-b from-bg/80 to-transparent backdrop-blur-sm",
        )}
        style={{ height: "var(--header-h)" }}
      >
        <div className="container-x grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          {/* Left - wordmark */}
          <div className="col-start-1 flex items-center">
            <Link href="/" data-cursor aria-label="Lumako home">
              <Logo />
            </Link>
          </div>

          {/* Center - primary nav, truly centered in the viewport.
             Explicit col-start keeps it in column 2 even when `hidden` on mobile
             removes it from grid auto-placement. */}
          <nav className="col-start-2 hidden items-center gap-[var(--vw-5)] md:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-cursor
                className="relative py-1 text-[length:var(--text-lg)] font-medium text-fg-muted transition-colors hover:text-fg"
              >
                <span className={cn(isActive(item.href) && "text-fg")}>
                  {item.label}
                </span>
                {isActive(item.href) && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-px bg-lume" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right - CTA, mobile toggle */}
          <div className="col-start-3 flex items-center justify-end gap-[var(--vw-3)]">
            <div className="hidden items-center md:flex">
              <LanguageToggle value={locale} onChange={setLocale} />
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-[210] flex size-10 flex-col items-center justify-center gap-1.5 md:hidden"
              data-cursor
            >
              <span
                className={cn(
                  "block h-px w-6 bg-fg transition-transform duration-300",
                  open && "translate-y-[3.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 bg-fg transition-transform duration-300",
                  open && "-translate-y-[3.5px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[205] flex flex-col justify-center bg-bg/95 px-[var(--vw-3)] backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <nav className="flex flex-col gap-2">
              {site.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: easeOutExpo }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-[length:var(--text-6xl)] font-light leading-tight text-fg"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
              <LanguageToggle value={locale} onChange={setLocale} />
              <a href={`mailto:${site.email}`} className="text-fg-muted">
                {site.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
