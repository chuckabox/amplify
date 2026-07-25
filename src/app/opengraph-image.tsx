import { ImageResponse } from "next/og";

export const alt =
  "Tonnage — most trucks roll straight over. Only some get pulled aside.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated at build time. Uses the bundled default face rather than fetching
// Fraunces over the network, so the build stays offline-safe.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#EFE8D8",
          padding: 72,
          color: "#171A14",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 44,
              height: 44,
              background: "#171A14",
              borderRadius: 4,
            }}
          />
          <div style={{ fontSize: 30, letterSpacing: "-0.02em" }}>
            Tonnage
          </div>
          <div style={{ flex: 1, height: 1, background: "#C1B494" }} />
          <div style={{ fontSize: 18, color: "#575C4E", letterSpacing: "0.14em" }}>
            RISK AUDIT ROUTING
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          <div>Most trucks roll straight over.</div>
          <div style={{ color: "#575C4E" }}>Only some get pulled aside.</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 48 }}>
          {[
            { pct: "68%", label: "cleared on evidence", c: "#4A6B52" },
            { pct: "22%", label: "verified remotely", c: "#B0791F" },
            { pct: "10%", label: "seen in person", c: "#9A3A2C" },
          ].map((t) => (
            <div
              key={t.pct}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <div style={{ display: "flex", width: 180, height: 6, background: t.c }} />
              <div style={{ fontSize: 40, letterSpacing: "-0.02em" }}>{t.pct}</div>
              <div style={{ fontSize: 20, color: "#575C4E" }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
