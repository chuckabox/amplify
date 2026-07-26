"use client";

import { useEffect, useRef, useState } from "react";
import { ScanLine } from "lucide-react";
import type { Box, DetectionKind, VideoKeyframe } from "@/lib/data/analysis";
import { KIND_COLOR } from "@/lib/detection-colors";

// Object detection overlay synced to video playback — hand-verified
// keyframes, interpolated continuously during playback. No live ML.
//
// Live detection (TensorFlow COCO-SSD, OpenCV Hough circles, OpenCV contour
// thresholding — four attempts total) was too unreliable on real handheld
// footage across every variation tried: jittery boxes, misdetection, and
// parts that don't exist as COCO classes at all (tyre, plate, cab). This
// keyframe approach is deliberately not live inference — frames of the
// actual footage were extracted every ~1s and reviewed directly, so every
// keyframe box sits on something real at that timestamp.
//
// During playback we don't jump between keyframes: every animation frame we
// read video.currentTime, find the two keyframes it falls between, and
// linearly interpolate each part's box between them. The result is
// continuous motion that's always close to the true position, not a
// hold-then-pop.
//
// A part keeps the SAME id across keyframes only while it's the same
// physical thing continuously visible (e.g. "cab" stays "cab" all the way
// around a walk-around, since it never leaves frame). When a part goes out
// of view and a *different* instance appears elsewhere — e.g. the near-side
// steer tyre during a 180° walk-around disappearing as the camera passes the
// front, then the far-side tyre becoming the new near side — it gets a new
// id ("tyre-a" / "tyre-b") with a gap of keyframes where neither is present.
// Reusing one id across that gap would linearly slide the box across the
// truck body between two unrelated positions, which is exactly the bug this
// avoids. Parts genuinely appearing/disappearing cross-fade instead of
// popping.

interface Sample {
  id: string;
  kind: DetectionKind;
  label: string;
  confidence: number;
  box: Box;
  opacity: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Sample every part's interpolated pose at time `t` (seconds).
function sampleAt(keyframes: VideoKeyframe[], t: number): Sample[] {
  if (keyframes.length === 0) return [];

  const first = keyframes[0];
  if (t <= first.t) {
    return first.detections.map((d) => ({ ...d, opacity: 1 }));
  }
  const last = keyframes[keyframes.length - 1];
  if (t >= last.t) {
    return last.detections.map((d) => ({ ...d, opacity: 1 }));
  }

  let i = 0;
  while (i < keyframes.length - 2 && keyframes[i + 1].t <= t) i++;
  const a = keyframes[i];
  const b = keyframes[i + 1];
  const span = b.t - a.t;
  const alpha = span > 0 ? (t - a.t) / span : 0;

  const aMap = new Map(a.detections.map((d) => [d.id, d]));
  const bMap = new Map(b.detections.map((d) => [d.id, d]));
  const ids = new Set([...aMap.keys(), ...bMap.keys()]);

  const out: Sample[] = [];
  for (const id of ids) {
    const da = aMap.get(id);
    const db = bMap.get(id);
    if (da && db) {
      out.push({
        id,
        kind: db.kind,
        label: db.label,
        confidence: lerp(da.confidence, db.confidence, alpha),
        box: {
          x: lerp(da.box.x, db.box.x, alpha),
          y: lerp(da.box.y, db.box.y, alpha),
          w: lerp(da.box.w, db.box.w, alpha),
          h: lerp(da.box.h, db.box.h, alpha),
        },
        opacity: 1,
      });
    } else if (da) {
      out.push({ ...da, opacity: 1 - alpha });
    } else if (db) {
      out.push({ ...db, opacity: alpha });
    }
  }
  return out;
}

export function VideoDetect({
  src,
  poster,
  keyframes,
}: {
  src: string;
  poster?: string;
  keyframes?: VideoKeyframe[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const countRef = useRef(-1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !keyframes) return;
    let running = true;

    function draw() {
      const ctx = canvas!.getContext("2d");
      if (!ctx || !video!.videoWidth) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      if (canvas!.width !== video!.videoWidth || canvas!.height !== video!.videoHeight) {
        canvas!.width = video!.videoWidth;
        canvas!.height = video!.videoHeight;
      }
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      const samples = sampleAt(keyframes!, video!.currentTime);
      const visible = samples.filter((s) => s.opacity > 0.04);

      const scale = canvas!.width / 640;
      const line = Math.max(2, 2.4 * scale);
      const font = Math.max(12, 15 * scale);
      const tick = Math.max(6, 9 * scale);

      for (const s of visible) {
        const color = KIND_COLOR[s.kind];
        const x = s.box.x * canvas!.width;
        const y = s.box.y * canvas!.height;
        const w = s.box.w * canvas!.width;
        const h = s.box.h * canvas!.height;

        ctx.save();
        ctx.globalAlpha = s.opacity;
        ctx.lineWidth = line;
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, w, h);

        ctx.lineWidth = line * 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y + tick); ctx.lineTo(x, y); ctx.lineTo(x + tick, y);
        ctx.moveTo(x + w - tick, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + tick);
        ctx.moveTo(x, y + h - tick); ctx.lineTo(x, y + h); ctx.lineTo(x + tick, y + h);
        ctx.moveTo(x + w - tick, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - tick);
        ctx.stroke();

        ctx.font = `600 ${font}px ui-sans-serif, system-ui, sans-serif`;
        const padX = 6 * scale;
        const chipH = font + 8 * scale;
        const textW = ctx.measureText(s.label).width;
        const chipY = y - chipH < 0 ? y : y - chipH;
        ctx.fillStyle = color;
        ctx.fillRect(x - line / 2, chipY, textW + padX * 2, chipH);
        ctx.fillStyle = "#ffffff";
        ctx.textBaseline = "middle";
        ctx.fillText(s.label, x - line / 2 + padX, chipY + chipH / 2 + 0.5 * scale);
        ctx.restore();
      }

      if (visible.length !== countRef.current) {
        countRef.current = visible.length;
        setCount(visible.length);
      }

      if (running) rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyframes]);

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
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
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />

        <div className="absolute right-2 top-2 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-white backdrop-blur">
          <ScanLine className="h-3.5 w-3.5" />
          {count} object{count === 1 ? "" : "s"}
        </div>

        <div className="absolute left-2 top-2 rounded-full bg-accent-deep/90 px-2.5 py-1 text-[11px] font-medium text-white">
          Object detection
        </div>
      </div>
    </div>
  );
}
