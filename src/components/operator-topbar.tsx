"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { useStore } from "@/lib/operator-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/fleet", label: "Fleet" },
  { href: "/audits", label: "Audits" },
  { href: "/premium", label: "Premium" },
];

export function OperatorTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { current, logout } = useStore();

  function signOut() {
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-double border-rule-strong bg-paper/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-8">
          <Logo href="/dashboard" size="sm" />

          <nav aria-label="Operator" className="hidden items-end gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative px-3 py-1.5 text-sm transition-colors duration-200 ease-docket",
                    active
                      ? "font-medium text-ink"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {item.label}
                  {/* the deck, echoing the wordmark, marks where you are */}
                  {active && (
                    <span
                      className="absolute inset-x-3 -bottom-px h-[2px] bg-accent"
                      aria-hidden
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <div className="text-[13px] leading-tight font-medium">
              {current?.name}
            </div>
            <div className="font-mono text-[11px] leading-tight text-ink-muted">
              {current?.policy.number}
            </div>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[2px] bg-ink font-mono text-[11px] font-medium text-paper">
            {current?.initials}
          </span>
          <button
            onClick={signOut}
            className="rounded-[2px] px-2 py-1 text-xs text-ink-muted transition-colors duration-200 ease-docket hover:bg-paper-sunk hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Mobile nav — the desktop row collapses to a scrollable rule of tabs */}
      <nav
        aria-label="Operator"
        className="flex gap-1 overflow-x-auto border-t border-rule px-4 md:hidden"
      >
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative shrink-0 px-3 py-2.5 text-sm",
                active ? "font-medium text-ink" : "text-ink-muted",
              )}
            >
              {item.label}
              {active && (
                <span
                  className="absolute inset-x-3 bottom-0 h-[2px] bg-accent"
                  aria-hidden
                />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
