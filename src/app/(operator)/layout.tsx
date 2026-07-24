"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { OperatorTopBar } from "@/components/operator-topbar";
import { useStore } from "@/lib/operator-store";

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { ready, current } = useStore();

  useEffect(() => {
    if (ready && !current) router.replace("/login");
  }, [ready, current, router]);

  if (!ready || !current) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OperatorTopBar />
      {children}
    </div>
  );
}
