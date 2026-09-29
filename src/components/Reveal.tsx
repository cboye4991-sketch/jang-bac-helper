import type { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return <div ref={ref} className={`reveal ${inView ? "is-visible" : ""} ${className}`}>{children}</div>;
}

export function CountUp({ to, active, duration = 1200 }: { to: number; active: boolean; duration?: number }) {
  return <CountUpInner key={String(active)} to={to} active={active} duration={duration} />;
}

import { useEffect, useState } from "react";
function CountUpInner({ to, active, duration }: { to: number; active: boolean; duration: number }) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setN(0); raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to, duration]);
  return <>{n}</>;
}
