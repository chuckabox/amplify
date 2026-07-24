"use client";

import { Loader2 } from "lucide-react";
import { EngineerTopBar } from "@/components/engineer-topbar";
import { useStore } from "@/lib/operator-store";

export default function EngineerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready } = useStore();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EngineerTopBar />
      {children}
    </div>
  );
}
