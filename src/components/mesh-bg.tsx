"use client";

import { MeshGradient } from "@mesh-gradient/react";

export function MeshBg() {
  return (
    <div className="fixed inset-0 -z-10">
      <MeshGradient
        options={{
          colors: ["#c7d8ea", "#a8c4e0", "#d4e4f4", "#eef1f5"],
          animationSpeed: 0.3,
        }}
        style={{ width: "100%", height: "100%" }}
      />
      <div className="absolute inset-0 bg-paper/60" />
    </div>
  );
}
