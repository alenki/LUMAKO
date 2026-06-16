"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content/site";
import { cn } from "@/lib/utils";

/** Live studio time (SF), updated each second. */
export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: site.timezone,
        }).format(new Date()),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className={cn(
        "font-mono text-[length:var(--text-mono)] uppercase tracking-[0.18em] text-fg-muted tabular-nums",
        className,
      )}
    >
      SF {time || "--:--:--"}
    </span>
  );
}
