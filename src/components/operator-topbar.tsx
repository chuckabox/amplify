"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { useStore } from "@/lib/operator-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/fleet", label: "Fleet" },
  { href: "/audits", label: "Checks" },
  { href: "/premium", label: "Price" },
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
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Logo href="/dashboard" />
          <nav className="hidden items-center gap-1 md:flex" data-tour="nav">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium leading-tight text-foreground">
              {current?.name}
            </div>
            <div className="text-xs leading-tight text-muted-foreground">
              {current?.policy.number}
            </div>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {current?.initials}
          </span>
          <button
            onClick={signOut}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
