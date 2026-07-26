"use client";

import { DotLottiePlayer } from "@dotlottie/react-player";
import { asset } from "@/lib/asset";

export function WarehouseLottie() {
  return (
    <DotLottiePlayer
      src={asset("/warehouse-delivery.lottie")}
      loop
      autoplay
      className="w-full [&_canvas]:!h-auto [&_canvas]:!w-full [&_svg]:!h-auto [&_svg]:!w-full"
    />
  );
}
