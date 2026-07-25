"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/lib/operator-store";

export default function NotFound() {
  const { current } = useStore();

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 py-12">
      <div className="w-full">
        <EmptyState
          title="Page not found (404)"
          body="The requested ticket or resource does not exist on this register. Please verify the URL or return to safety."
          action={
            <div className="flex flex-wrap gap-3">
              {current ? (
                <Link href="/dashboard">
                  <Button variant="accent">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="accent">Sign In</Button>
                </Link>
              )}
              <Link href="/">
                <Button variant="outline">Back to Homepage</Button>
              </Link>
            </div>
          }
        />
        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-ink-faint">
            REF: ERR-404-NOT-FOUND · TONNAGE
          </p>
        </div>
      </div>
    </main>
  );
}
