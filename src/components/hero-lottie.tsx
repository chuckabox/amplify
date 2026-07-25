"use client";

import Lottie from "lottie-react";
import animationData from "../../public/car-loading.json";

export function HeroLottie() {
  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className="w-[140%] max-w-none -mr-[20%]"
    />
  );
}
