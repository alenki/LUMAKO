"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";
import { site } from "@/lib/content/site";
import { Logo } from "@/components/ui/Logo";
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
          "fixed inset-x-0 top-0 z-[200]",
          // The header (z-200) paints above the panel (z-150). Fade its scroll
          // background only when the menu is closed - on open we need it gone
          // instantly, or the 500ms colour fade leaves the white scrolled
          // background lingering over the dark menu for that beat. Closing keeps
          // the fade, so the header eases back in behind the dismissing panel.
          !open && "transition-colors duration-500",
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
            animate={{ opacity: atFooter || open ? 0 : 1 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            inert={atFooter || open}
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
              className={cn(
                "relative flex size-10 flex-col items-center justify-center gap-[5px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
                open && "translate-y-[18px] -translate-x-[6px]",
              )}
              data-cursor
            >
              <span
                className={cn(
                  "block origin-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "h-[3px] w-7 bg-white" : "h-0.5 w-6 bg-fg",
                  open && "translate-y-[4px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block origin-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "h-[3px] w-7 bg-white" : "h-0.5 w-6 bg-fg",
                  open && "-translate-y-[4px] -rotate-45",
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

/** Stagger metronome: each row reveals a beat after the one above it. A small base
 *  delay lets the card spring open first, so the index wipes in just behind it. */
const ROW_STAGGER = 0.06;
const ROW_BASE_DELAY = 0.18;

/** Monumental index-word size. Scales with viewport width AND height (`min`) so the
 *  full stack stays whole on short / landscape phones, floored for tiny screens and
 *  capped on the largest. */
const LABEL_SIZE = "clamp(2rem, min(11vw, 7.5vh), 3.25rem)";

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
          onClick={onClose}
          className="fixed inset-0 z-[150] bg-black/15 backdrop-blur-[2px] outline-none md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.4, ease: easeOutExpo }}
        >
          {/* In-dialog dismiss for screen-reader / browse-mode users. The visible
              close affordance is the header toggle (the X over the card's top-right),
              but with aria-modal the browse cursor is constrained to this subtree, so
              the modal needs its own reachable close control. */}
          <button type="button" onClick={onClose} className="sr-only">
            Close menu
          </button>

          {/* The card - a pure-black top-anchored dropdown. It springs open from the
              top-right corner (nearest the toggle) and settles, the index wiping in
              just behind it. Swallows clicks; only the backdrop, the X, or a link
              closes it. */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-[0.75rem] top-[0.75rem] overflow-hidden rounded-[1.1rem] border border-white/10 bg-black shadow-[0_30px_90px_-24px_rgba(0,0,0,0.55)]"
            style={{ transformOrigin: "top right" }}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.92, y: reduce ? 0 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : -6 }}
            transition={{ duration: reduce ? 0.2 : 0.5, ease: easeOutExpo }}
          >
            {/* Content layer - the index stacks from the top of the card. It only
                scrolls inside the card if it ever outgrows the viewport (tiny / short
                screens); otherwise the card simply hugs it. */}
            <div
              data-lenis-prevent
              className="relative max-h-[calc(100dvh-1.5rem)] overflow-y-auto overflow-x-clip overscroll-contain"
            >
              <div
                className="flex flex-col px-[clamp(2rem,9vw,3.5rem)]"
                style={{
                  paddingTop: "calc(var(--header-h) + var(--vw-2))",
                  paddingBottom: "max(calc(var(--vw) * 7), env(safe-area-inset-bottom))",
                }}
              >
                {/* The index - monumental stacked words. No ordinals, no rules: the
                    words carry the whole panel, and the current page is marked by the
                    wordmark's lume period. */}
                <nav aria-label="Primary">
                  <ul className="flex flex-col gap-[clamp(0.55rem,2.3vh,1.2rem)]">
                    {site.nav.map((item, i) => {
                      const active = isActive(item.href);
                      return (
                        <li key={item.href}>
                          <MenuReveal reduce={reduce} index={i}>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              data-cursor
                              aria-current={active ? "page" : undefined}
                              className="group inline-block py-[0.04em]"
                            >
                              <span
                                className="font-display [font-weight:750] uppercase leading-[0.92] tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-white/70"
                                style={{ fontSize: LABEL_SIZE }}
                              >
                                {item.label}
                                {/* The lume period - the wordmark's dot, marking the
                                    page you're on. The panel's single accent, sat on
                                    the baseline because it's inline with the word. */}
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
                            </Link>
                          </MenuReveal>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>
          </motion.div>
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
