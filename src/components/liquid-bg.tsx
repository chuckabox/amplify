"use client";

import { DotLottiePlayer } from "@dotlottie/react-player";
import { asset } from "@/lib/asset";

export function LiquidBg() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-30">
      <div className="flex h-[300%] w-[300%] min-h-[1000px] min-w-[1800px] max-w-none items-center justify-center scale-125">
        <DotLottiePlayer
          src={asset("/liquid-bg.lottie")}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
          className="h-full w-full [&_canvas]:!h-full [&_canvas]:!w-full [&_canvas]:!object-cover [&_svg]:!h-full [&_svg]:!w-full [&_svg]:!object-cover"
        />
      </div>
    </div>
  );
}
