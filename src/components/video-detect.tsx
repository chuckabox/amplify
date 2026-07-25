"use client";

import { useEffect, useRef, useState } from "react";
import { ScanLine, Loader2 } from "lucide-react";

// Real in-browser object detection over the walk-around video.
//
// Loads TensorFlow.js + the COCO-SSD model on the client, then runs live
// detection on each played frame and paints bounding boxes onto a canvas
// overlaid on the <video>. No fixtures — these boxes are the model's real
// output, tracking trucks, cars and people as the clip plays.

type Prediction = {
  bbox: [number, number, number, number]; // x, y, w, h in video pixels
  class: string;
  score: number;
};

// Minimal shape of the loaded model so we don't need the model's types.
type CocoModel = {
  detect: (
    input: HTMLVideoElement,
    maxBoxes?: number,
    minScore?: number,
  ) => Promise<Prediction[]>;
};

// COCO classes → a friendlier label + which design token colours the box.
const VEHICLE = new Set([
  "truck",
  "car",
  "bus",
  "motorcycle",
  "train",
  "boat",
  "airplane",
]);

function friendlyLabel(cls: string): string {
  if (cls === "truck") return "Truck";
  if (cls === "car") return "Vehicle";
  if (cls === "potted plant") return "Foliage";
  return cls.charAt(0).toUpperCase() + cls.slice(1);
}

// Resolve a CSS custom property to a concrete colour for canvas painting.
function tokenColor(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

const MIN_SCORE = 0.45;

export function VideoDetect({
  src,
  poster,
  caption,
}: {
  src: string;
  poster?: string;
  caption?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<CocoModel | null>(null);
  const rafRef = useRef<number>(0);

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [count, setCount] = useState(0);

  // ---- Load model once ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const tf = await import("@tensorflow/tfjs");
        const cocoSsd = await import("@tensorflow-models/coco-ssd");
        await tf.setBackend("webgl").catch(() => tf.setBackend("cpu"));
        await tf.ready();
        const model = await cocoSsd.load({ base: "lite_mobilenet_v2" });
        if (cancelled) return;
        modelRef.current = model as unknown as CocoModel;
        setStatus("ready");
      } catch (err) {
        console.error("Detection model failed to load", err);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Paint one set of boxes ----
  function draw(preds: Prediction[]) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Keep the drawing buffer matched to the video's native resolution so
    // model coordinates (video pixels) map 1:1 onto the canvas.
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ink = tokenColor("--ink", "#16181d");
    const accent = tokenColor("--accent-deep", "#0f766e");
    const hazard = tokenColor("--tier-3-ink", "#b3261e");
    const watch = tokenColor("--tier-2-ink", "#a25b00");

    const scale = canvas.width / 640;
    const line = Math.max(2, 2.4 * scale);
    const font = Math.max(12, 15 * scale);
    const tick = Math.max(6, 9 * scale);

    for (const p of preds) {
      const [x, y, w, h] = p.bbox;
      const color = VEHICLE.has(p.class)
        ? p.class === "truck" || p.class === "bus"
          ? ink
          : accent
        : p.class === "person"
          ? hazard
          : watch;

      // box
      ctx.lineWidth = line;
      ctx.strokeStyle = color;
      ctx.strokeRect(x, y, w, h);

      // corner ticks
      ctx.lineWidth = line * 1.4;
      ctx.beginPath();
      // top-left
      ctx.moveTo(x, y + tick); ctx.lineTo(x, y); ctx.lineTo(x + tick, y);
      // top-right
      ctx.moveTo(x + w - tick, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + tick);
      // bottom-left
      ctx.moveTo(x, y + h - tick); ctx.lineTo(x, y + h); ctx.lineTo(x + tick, y + h);
      // bottom-right
      ctx.moveTo(x + w - tick, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - tick);
      ctx.stroke();

      // label chip
      const label = `${friendlyLabel(p.class)}  ${(p.score * 100).toFixed(0)}%`;
      ctx.font = `600 ${font}px ui-sans-serif, system-ui, sans-serif`;
      const padX = 6 * scale;
      const chipH = font + 8 * scale;
      const textW = ctx.measureText(label).width;
      const chipW = textW + padX * 2;
      const chipY = y - chipH < 0 ? y : y - chipH;
      ctx.fillStyle = color;
      ctx.fillRect(x - line / 2, chipY, chipW, chipH);
      ctx.fillStyle = "#ffffff";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x - line / 2 + padX, chipY + chipH / 2 + 0.5 * scale);
    }
  }

  // ---- Detection loop, gated on playback ----
  useEffect(() => {
    if (status !== "ready") return;
    const video = videoRef.current;
    if (!video) return;

    let running = true;

    async function tick() {
      if (!running) return;
      const model = modelRef.current;
      const v = videoRef.current;
      if (model && v && !v.paused && !v.ended && v.readyState >= 2) {
        try {
          const preds = await model.detect(v, 20, MIN_SCORE);
          draw(preds);
          setCount(preds.length);
        } catch {
          /* transient frame errors are fine */
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="relative">
      <div className="relative">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          autoPlay
          muted
          loop
          playsInline
          className="block max-h-[460px] w-full bg-black object-contain"
        />
        {/* detection overlay — same displayed box as the video */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />

        {/* status / live count chip */}
        <div className="absolute right-2 top-2 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-white backdrop-blur">
          {status === "loading" ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading detector…
            </>
          ) : status === "error" ? (
            "Detector unavailable"
          ) : (
            <>
              <ScanLine className="h-3.5 w-3.5" />
              {count} object{count === 1 ? "" : "s"}
            </>
          )}
        </div>

        <div className="absolute left-2 top-2 rounded-full bg-accent-deep/90 px-2.5 py-1 text-[11px] font-medium text-white">
          Live object detection
        </div>
      </div>

      {caption && (
        <p className="mt-2 text-[11px] text-ink-faint">{caption}</p>
      )}
    </div>
  );
}
