"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";
import { site } from "@/lib/content/site";
import { Logo } from "@/components/ui/Logo";
import { LocalTime } from "@/components/layout/LocalTime";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";
import { useScrolled } from "@/lib/mediaHooks";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useScrollLock } from "@/lib/useScrollLock";
import { useFooterInView } from "@/lib/footerInView";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(24);
  const atFooter = useFooterInView();
  const reduce = useReducedMotion() ?? false;

  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Freeze the page behind the panel while it's open.
  useScrollLock(open);

  // Hide the rest of the page from assistive tech and the tab order while the
  // dialog is open. aria-modal alone doesn't reliably stop a screen reader's
  // virtual cursor from swiping into the page behind; inert does. The header
  // (wordmark + close toggle) is deliberately left active.
  useEffect(() => {
    if (!open) return;
    const targets = [
      document.getElementById("main"),
      document.querySelector("footer"),
    ].filter(Boolean) as HTMLElement[];
    targets.forEach((el) => {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    });
    return () => {
      targets.forEach((el) => {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      });
    };
  }, [open]);

  // Close on browser back/forward. In-app link clicks close the panel in their own
  // handlers (below); popstate is the one navigation those don't catch. Listening
  // for the event keeps the setState in a callback, not synchronously in an effect.
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  // Escape to close + a focus trap that loops between the toggle and the panel's
  // links, so a keyboard user can always reach the close button and never tabs out
  // into the frozen page behind. Focus lands on the panel itself on open, and is
  // returned to the toggle on close.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (!open) {
      // Closing: hand focus back to the toggle so the keyboard user lands where
      // they left off (only when we were the ones who took it).
      if (wasOpen.current) toggleRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = [
        toggleRef.current,
        ...Array.from(
          panelRef.current?.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          ) ?? [],
        ),
      ].filter(Boolean) as HTMLElement[];
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[200] transition-colors duration-500",
          open
            ? "bg-transparent"
            : scrolled
              ? "bg-bg/70 backdrop-blur-xl"
              : "bg-gradient-to-b from-bg/80 to-transparent backdrop-blur-sm",
        )}
        style={{ height: "var(--header-h)" }}
      >
        <div className="container-x grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          {/* Left - wordmark. Retires once the footer's monumental wordmark is on
             screen, so the two never share a frame - but stays put while the menu
             is open, anchoring the panel's top-left. */}
          <motion.div
            className="col-start-1 flex items-center"
            animate={{ opacity: atFooter && !open ? 0 : 1 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            inert={atFooter && !open}
          >
            <Link
              href="/"
              data-cursor
              aria-label="Lumako home"
              onClick={() => setOpen(false)}
            >
              <Logo />
            </Link>
          </motion.div>

          {/* Center - primary nav, truly centered in the viewport.
             Explicit col-start keeps it in column 2 even when `hidden` on mobile
             removes it from grid auto-placement. */}
          <nav className="col-start-2 hidden items-center gap-[calc(var(--vw)*3.75)] md:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-cursor
                className={cn(
                  "py-1 text-[length:var(--text-lg)] font-medium transition-colors hover:text-fg",
                  isActive(item.href) ? "text-fg" : "text-fg-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right - mobile toggle. Sits in the header's own stacking context, which
             paints above the panel (z-[150] < header z-[200]), so the close control
             stays visible and clickable over the open menu. */}
          <div className="col-start-3 flex items-center justify-end gap-[var(--vw-3)]">
            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="relative flex size-10 flex-col items-center justify-center gap-[5px] md:hidden"
              data-cursor
            >
              <span
                className={cn(
                  "block h-px w-6 origin-center bg-fg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open && "translate-y-[3px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 origin-center bg-fg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open && "-translate-y-[3px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={open}
        reduce={reduce}
        isActive={isActive}
        onClose={() => setOpen(false)}
        panelRef={panelRef}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */

type MobileMenuProps = {
  open: boolean;
  reduce: boolean;
  isActive: (href: string) => boolean;
  onClose: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
};

/** Stagger metronome: each row reveals a beat after the one above it. */
const ROW_STAGGER = 0.06;
const ROW_BASE_DELAY = 0.14;

/** Index-link size. Scales with viewport width AND height (`min`) so long lists
 *  stay whole on short / landscape phones, floored and capped for tiny and large
 *  screens alike. */
const LABEL_SIZE = "clamp(2.25rem, min(8.6vw, 7vh), 4.25rem)";

function MobileMenu({ open, reduce, isActive, onClose, panelRef }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          tabIndex={-1}
          className="fixed inset-0 z-[150] overflow-hidden bg-bg/90 backdrop-blur-2xl outline-none md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.45, ease: easeOutExpo }}
        >
          {/* In-dialog dismiss for screen-reader / browse-mode users. The visible
              close affordance is the header toggle, but with aria-modal the browse
              cursor is constrained to this subtree, so the modal needs its own
              reachable close control. */}
          <button type="button" onClick={onClose} className="sr-only">
            Close menu
          </button>

          {/* Decorative bleed, clipped by the panel and kept OUT of the scroll
              container below so none of it can add to the content's scroll height.
              Atmosphere = the site's grain veil + one soft top glow; the monumental
              ghost wordmark bleeding off the bottom quotes the footer at a whisper,
              so the panel reads as the same book. */}
          <span className="noise-veil" aria-hidden />
          <div
            aria-hidden
            className="glow-accent pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-60"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-[0.18em] left-[calc(var(--gutter)-0.04em)] select-none font-display font-semibold leading-[0.8] tracking-[-0.04em] text-fg opacity-[0.04] [font-size:clamp(9rem,42vw,20rem)]"
          >
            Lumako<span className="text-lume">.</span>
          </span>

          {/* Scrollable content - its own layer so genuinely tall lists (short or
              landscape screens) scroll inside the panel, while the decorative bleed
              above never contributes a stray scrollbar. */}
          <div
            data-lenis-prevent
            className="relative h-full overflow-y-auto overflow-x-clip overscroll-contain"
          >
            <div
              className="container-x relative flex min-h-full flex-col"
              style={{
                paddingTop: "calc(var(--header-h) + var(--vw-3))",
                paddingBottom: "max(var(--vw-4), env(safe-area-inset-bottom))",
              }}
            >
              {/* Top meta row - the studio instrument, framing the index. */}
              <MenuReveal reduce={reduce} index={0} className="flex items-center justify-between">
                <span className="label-caps">Index</span>
                <LocalTime />
              </MenuReveal>

              {/* The index - a numbered editorial ledger. */}
              <nav aria-label="Primary" className="flex flex-1 flex-col justify-center py-[clamp(0.5rem,2.5vh,2rem)]">
                <ul className="flex flex-col">
                  {site.nav.map((item, i) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href} className="border-t border-line last:border-b">
                        <MenuReveal reduce={reduce} index={i + 1}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            data-cursor
                            aria-current={active ? "page" : undefined}
                            className="group flex items-baseline gap-[var(--vw-3)] py-[clamp(0.7rem,2.2vh,1.4rem)]"
                          >
                            {/* Decorative editorial ordinal - aria-hidden so the
                                screen reader reads a clean "Home", not "01 Home".
                                Colour comes from .label-caps (fg-muted), matching
                                every other label on the site; the active row is
                                signalled by the lume period + aria-current, not by
                                recolouring this number. (.label-caps sets colour as
                                an unlayered rule, so a text-* utility here wouldn't
                                win anyway.) */}
                            <span aria-hidden className="label-caps w-[2.5ch] shrink-0 tabular-nums">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              className="inline-flex font-display font-medium leading-[1.02] tracking-tight text-fg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[0.12em]"
                              style={{ fontSize: LABEL_SIZE }}
                            >
                              {item.label}
                              {/* The lume period - the wordmark's dot, marking the
                                  page you're on. The one accent in the panel, and
                                  perfectly on the baseline because it's set on the
                                  same line as the label. */}
                              <span
                                aria-hidden
                                className={cn(
                                  "text-lume transition-opacity duration-300",
                                  active ? "opacity-100" : "opacity-0",
                                )}
                              >
                                .
                              </span>
                            </span>
                            <span
                              aria-hidden
                              className="ml-auto self-center text-fg-dim opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [font-size:var(--text-2xl)] group-hover:translate-x-1 group-hover:opacity-100"
                            >
                              &rarr;
                            </span>
                          </Link>
                        </MenuReveal>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Base block - contact + socials, anchored to the bottom edge. */}
              <MenuReveal
                reduce={reduce}
                index={site.nav.length + 1}
                className="flex flex-wrap items-end justify-between gap-x-[var(--vw-4)] gap-y-[var(--vw-2)] border-t border-line pt-[var(--vw-3)]"
              >
                <div className="flex flex-col gap-1">
                  <span className="label-caps">Get in touch</span>
                  <a
                    href={`mailto:${site.email}`}
                    data-cursor
                    className="text-[length:var(--text-xl)] font-medium text-fg transition-colors hover:text-fg-body"
                  >
                    {site.email}
                  </a>
                </div>
                <nav aria-label="Social" className="flex flex-wrap items-center gap-x-[var(--vw-3)] gap-y-1">
                  {site.socials.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor
                      className="label-caps transition-colors hover:text-fg"
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
              </MenuReveal>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */

type MenuRevealProps = {
  reduce: boolean;
  index: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * One staggered line of the panel. Full motion is the site's editorial reveal -
 * a mask wipe up with a blur settle - clipped to its own row. Under reduced
 * motion it's a plain, instant fade with no transform, blur, or stagger.
 */
function MenuReveal({ reduce, index, className, children }: MenuRevealProps) {
  const variants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        hidden: {
          opacity: 0,
          y: "0.5em",
          clipPath: "inset(0 0 110% 0)",
          filter: "blur(8px)",
        },
        show: {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 -10% 0)",
          filter: "blur(0px)",
          transition: {
            duration: 0.8,
            ease: easeOutExpo,
            delay: ROW_BASE_DELAY + index * ROW_STAGGER,
          },
        },
        exit: {
          opacity: 0,
          y: "-0.2em",
          filter: "blur(4px)",
          transition: { duration: 0.25, ease: easeOutExpo },
        },
      };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
