"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Papers Published", value: 2500, suffix: "+" },
  { label: "Active Reviewers", value: 150, suffix: "+" },
  { label: "Citations", value: 12000, suffix: "+" },
  { label: "Countries", value: 45, suffix: "" },
];

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function StatCard({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { count, ref } = useCountUp(value);

  return (
    <div ref={ref} className="text-center p-6">
      <div className="font-serif text-4xl font-bold text-primary">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
