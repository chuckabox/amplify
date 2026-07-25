"use client";

import { DotLottiePlayer } from "@dotlottie/react-player";
import { asset } from "@/lib/asset";

export function WaveBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
      <div className="absolute inset-0 scale-150">
        <DotLottiePlayer
          src={asset("/wave-bg.lottie")}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
