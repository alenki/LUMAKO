/** Static luminous fallback — shown while the canvas loads, and for low-power
 *  devices / reduced motion. No WebGL, no layout shift. */
export function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      {/* Luminous core */}
      <div
        className="absolute left-1/2 top-1/2 size-[42rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,154,46,0.28), rgba(212,154,46,0.05) 45%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      {/* Hairline horizon grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,10,10,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(circle at 50% 45%, black, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 45%, black, transparent 70%)",
        }}
      />
      <div className="noise-veil" />
    </div>
  );
}
