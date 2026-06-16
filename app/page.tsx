// TEMPORARY token/font verification page — replaced by the real Home in Phase 5.
export default function Home() {
  return (
    <main className="relative min-h-dvh">
      <div className="glow-accent absolute inset-0" aria-hidden />
      <div className="container-x section-lg relative">
        <p className="font-mono text-[var(--text-mono)] uppercase tracking-[0.25em] text-fg-muted">
          (web &amp; product studio) — verification
        </p>

        <h1 className="font-display mt-8 max-w-[18ch] text-[length:var(--text-7xl)] font-light leading-[0.95] tracking-tight text-balance">
          We design &amp; build the products people{" "}
          <em className="italic text-accent">don&apos;t forget.</em>
        </h1>

        <p className="mt-8 max-w-[48ch] text-[length:var(--text-xl)] text-fg-muted text-pretty">
          Token, font, and fluid-scale smoke test. Fraunces display, Hanken
          Grotesk body, Geist Mono labels, on the dark monochrome + electric
          blue palette.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#"
            className="rounded-full bg-accent px-7 py-3 text-bg font-medium transition-colors hover:bg-accent-deep"
          >
            Start a project
          </a>
          <a
            href="#"
            className="rounded-full border border-line-strong px-7 py-3 text-fg transition-colors hover:bg-card"
          >
            View work
          </a>
          <span className="inline-flex items-center gap-2 font-mono text-[var(--text-mono)] text-fg-dim">
            <span className="size-2 rounded-full bg-spark" /> available for Q3
          </span>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
          {[
            ["bg-bg", "bg"],
            ["bg-card", "card"],
            ["bg-accent", "accent"],
            ["bg-spark", "spark"],
          ].map(([cls, label]) => (
            <div key={label} className={`${cls} p-8`}>
              <span className="font-mono text-[var(--text-mono)] text-fg-muted">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
