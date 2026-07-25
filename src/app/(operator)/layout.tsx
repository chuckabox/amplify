"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OperatorTopBar } from "@/components/operator-topbar";
import { Skeleton } from "@/components/ui/skeleton";
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

  // A skeleton shaped like the page that's coming, not a spinner in a void.
  if (!ready || !current) {
    return (
      <div className="min-h-[100dvh]">
        <div className="border-b-[3px] border-double border-rule-strong">
          <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="size-9" />
          </div>
        </div>
        <div className="mx-auto max-w-[1240px] px-6 py-12">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-5 h-11 w-2/3 max-w-md" />
          <div className="mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-paper-raised p-6">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-4 h-8 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-6 h-64 w-full" />
        </div>
        <span className="sr-only" role="status">
          Loading your portal
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <OperatorTopBar />
      {children}
    </div>
  );
}
