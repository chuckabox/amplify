"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TOUR_KEY = "tonnage:tourSeen";

const STEPS = [
  {
    element: '[data-tour="start-audit"]',
    popover: {
      title: "Start here",
      description:
        "This is the main thing you do: your safety check. It takes about 15 minutes on your phone — a few photos and quick questions.",
    },
  },
  {
    element: '[data-tour="stats"]',
    popover: {
      title: "Your key numbers",
      description:
        "Your fleet size, your yearly price, distance driven, and when your next check is due. Tap any card to open it.",
    },
  },
  {
    element: '[data-tour="premium"]',
    popover: {
      title: "Your price",
      description:
        "This is what you pay each year. It goes down when you pass a check. Tap to see exactly how it's worked out.",
    },
  },
  {
    element: '[data-tour="nav"]',
    popover: {
      title: "Getting around",
      description:
        "Use these links to move between your Home, your Fleet, your past Checks, and your Price.",
    },
  },
];

function runTour() {
  const d = driver({
    showProgress: true,
    allowClose: true,
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Got it",
    popoverClass: "tonnage-tour",
    steps: STEPS,
  });
  d.drive();
}

export function OperatorTour() {
  const [askOpen, setAskOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(TOUR_KEY)) {
      const t = setTimeout(() => setAskOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  function markSeen() {
    window.localStorage.setItem(TOUR_KEY, "1");
  }

  function start() {
    setAskOpen(false);
    markSeen();
    // Let the dialog close before the spotlight opens.
    setTimeout(runTour, 200);
  }

  function skip() {
    setAskOpen(false);
    markSeen();
  }

  return (
    <>
      {/* Manual replay button (sits in the greeting banner) */}
      <button
        onClick={() => setTimeout(runTour, 50)}
        className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-white/25"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        Take a tour
      </button>

      <Dialog open={askOpen} onOpenChange={setAskOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle>Welcome to Tonnage</DialogTitle>
            <DialogDescription>
              First time here? We can give you a quick 4-step tour of the
              screen so you know what everything does. It takes about 30 seconds.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={skip}>
              Skip for now
            </Button>
            <Button onClick={start} className="gap-1.5">
              <Sparkles className="h-4 w-4" />
              Show me around
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
