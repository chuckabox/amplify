import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-foreground">
        RiskGate
      </span>
    </Link>
  );
}
