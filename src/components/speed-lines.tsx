"use client";

const LINES = [
  { top: "6%", w: "8%", duration: "3.2s", delay: "0s", opacity: 0.2 },
  { top: "14%", w: "5%", duration: "4.1s", delay: "1.4s", opacity: 0.15 },
  { top: "26%", w: "10%", duration: "2.8s", delay: "0.6s", opacity: 0.22 },
  { top: "38%", w: "6%", duration: "3.6s", delay: "2.1s", opacity: 0.13 },
  { top: "50%", w: "9%", duration: "3.9s", delay: "0.3s", opacity: 0.18 },
  { top: "62%", w: "7%", duration: "2.5s", delay: "1.8s", opacity: 0.2 },
  { top: "74%", w: "5%", duration: "3.4s", delay: "0.9s", opacity: 0.15 },
  { top: "86%", w: "8%", duration: "3.0s", delay: "1.1s", opacity: 0.12 },
];

export function SpeedLines() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
      {LINES.map((l, i) => (
        <div
          key={i}
          className="absolute bg-ink"
          style={{
            top: l.top,
            left: 0,
            width: l.w,
            height: "1px",
            opacity: l.opacity,
            animation: `speed-line ${l.duration} ${l.delay} linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
