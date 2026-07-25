"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function HeroLottie() {
  return (
    <DotLottieReact
      src={`${basePath}/car-loading.lottie`}
      loop
      autoplay
      className="w-[140%] max-w-none -mr-[20%]"
    />
  );
}
