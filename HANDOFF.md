# Weighbridge — Redesign Handoff

## What this is

A complete visual redesign of the Weighbridge (formerly RiskGate) web app, a heavy-vehicle risk-audit platform for NTI. The redesign replaces a generic blue/Inter/rounded-card AI-startup look with an editorial, institutional-trust aesthetic built on physical artefacts (weighbridge tickets, carbon ink, signal yellow markings).

---

## Design system: "Docket"

All tokens live in `src/app/globals.css` as CSS custom properties.

| Token | Value | Purpose |
|-------|-------|---------|
| `--paper` | `#EFE8D8` | Manila background |
| `--ink` | `#171A14` | Carbon-green text |
| `--accent` | `#C9A227` | Signal yellow — the only accent |
| `--tier-1` | `#4A6B52` | Cleared (green ink) |
| `--tier-2` | `#B0791F` | Remote verification (amber ink) |
| `--tier-3` | `#9A3A2C` | Escalated (oxide ink) |

**Typography**: Fraunces (display, variable SOFT/WONK/opsz) · Archivo (body/UI) · JetBrains Mono (tabular data). All loaded via `next/font/google` in `src/app/layout.tsx`.

**Corners**: Square — `2px` to `10px` max. No pills.

**Motion**: `motion` (motion.dev) only. Components in `src/components/motion.tsx`: `Reveal`, `Stagger`/`StaggerItem`, `Ticker`. All respect `prefers-reduced-motion`.

**Theme**: Light only. One deliberate dark section exists on the marketing page closing CTA (`bg-ink text-paper`). No dark mode CSS at all.

**Grain**: SVG noise overlay via `--grain` data URI, applied by `.grain-overlay` div in root layout.

---

## What's DONE

### Infrastructure & tokens
- [x] `src/app/globals.css` — Full Docket design system (custom properties, shadows, easing, grain, component classes, skeleton keyframes, reduced-motion)
- [x] `src/app/layout.tsx` — Three fonts, metadata ("Weighbridge — risk audits that route themselves"), grain overlay, skip-to-content
- [x] `src/app/icon.svg` — SVG favicon (weighbridge metaphor)
- [x] `src/app/opengraph-image.tsx` — OG image via `ImageResponse`

### Components (new)
- [x] `src/components/motion.tsx` — Reveal, Stagger, StaggerItem, Ticker
- [x] `src/components/figure.tsx` — Stat display with tone variants
- [x] `src/components/photo-plate.tsx` — Duotone photography with plate mount
- [x] `src/components/tier-split.tsx` — Hand-rolled SVG routing diagram (animated)
- [x] `src/components/ui/skeleton.tsx`
- [x] `src/components/ui/empty-state.tsx`
- [x] `src/components/ui/field-error.tsx`

### Components (restyled)
- [x] `src/components/logo.tsx` — Wordmark with broken deck plate
- [x] `src/components/tier-badge.tsx` — Stamped label + StatusStamp
- [x] `src/components/operator-topbar.tsx` — Double-rule header, active underline
- [x] `src/components/ui/button.tsx` — Square, warm shadows, `ButtonIconWell`
- [x] `src/components/ui/badge.tsx` — Tracked caps, stamped
- [x] `src/components/ui/card.tsx` — 4px radius, rule border
- [x] `src/components/ui/input.tsx` — Inset shadow, rule border
- [x] `src/components/ui/dialog.tsx` — Paper-sunk footer, Fraunces title
- [x] `src/components/ui/table.tsx` — Printed register, double-rule header
- [x] `src/components/ui/progress.tsx` — Ruled bar, not pill
- [x] `src/components/ui/label.tsx`
- [x] `src/components/ui/textarea.tsx`

### Pages (fully redesigned)
- [x] `src/app/(marketing)/page.tsx` — Flagship: masthead, asymmetric hero with PhotoPlate, Ticker stats, TierSplit SVG, zig-zag steps, anti-gaming grid, multiplier before/after, dark closing CTA, footer
- [x] `src/app/(auth)/login/page.tsx` — Split: brand panel with duotone photo + form panel with ruled tab switch, demo fleet picker, real validation
- [x] `src/app/(operator)/layout.tsx` — Skeleton loading state shaped like actual page
- [x] `src/app/(operator)/dashboard/page.tsx` — Docket head with policy metadata, 4-col ledger, latest audit with StatusStamp, plate-mounted premium card, ruled benchmark gauge
- [x] `src/app/(operator)/fleet/page.tsx` — Table with footer totals, add-vehicle dialog with validation, grid vehicle class selector, empty state
- [x] `src/app/(operator)/audits/page.tsx` — Ruled list, empty state, premium delta display
- [x] `src/app/(operator)/audits/[id]/page.tsx` — Certificate head, 3-col figure grid, findings register with severity gauge, recommendation boxes
- [x] `src/app/(operator)/premium/page.tsx` — Numbered calculation sections (01/02/03) with dotted leaders, double-rule total, sidebar with policy details

### Data
- [x] `src/lib/data/operators.ts` — Renamed operators (Halloran Haulage, Tanami Freight Lines, Coalfields Carriers), organic numbers, active-voice copy, `MILEAGE_RATE_PER_MILLION_KM` constant
- [x] `src/lib/operator-store.tsx` — Storage key → `"weighbridge:v1"`

---

## What's NOT DONE

### 1. Guided audit flow (operator) — `src/app/(operator)/audit/new/page.tsx`
**Status**: Untouched. Still has old RiskGate design — Lucide icons, blue theme, `rounded-xl`, `bg-accent`, `text-foreground`/`text-muted-foreground` semantic colors, pill progress bar.

**What it needs**:
- Strip all Lucide icon imports (ArrowLeft, ArrowRight, Check, Loader2, Camera, Upload, ShieldCheck, Sparkles, X) — replace with mono text arrows `←`/`→`, inline SVG or text equivalents
- Replace `Shell` wrapper with proper `<main>` tag matching other operator pages
- Replace pill `ProgressBar` with a ruled measure bar (stepped ticks like the severity gauge on audit detail)
- Restyle intro step: replace rounded-xl icon with field-label + Fraunces heading, numbered pillar list with ruled dividers instead of cards
- Restyle pillar question steps: replace rounded-lg option buttons with ruled radio-style selectors using the Docket palette, replace pill radio indicators with square or no-fill indicators
- Restyle evidence step: replace rounded-xl cards with rule-bordered sections, Camera button with a Docket-styled button
- Restyle analyzing step: replace Sparkles pulse with a typographic loading state (use the `Skeleton` component or a staged text list with the Docket step counter pattern `01`/`02`/etc.)
- Restyle result step: replace emerald-100 circle check with a Docket certificate head (double-rule, TierBadge), replace rounded-2xl premium card with the plate pattern
- Use `Reveal` animation wrappers
- Use the Docket color tokens (`bg-paper`, `text-ink`, `border-rule`, etc.) instead of shadcn semantic tokens (`bg-card`, `text-foreground`, `border-border`)
- 528 lines, multi-step wizard with 8 states (intro, 4 pillars, evidence, analyzing, result)

### 2. Engineer queue — `src/app/(engineer)/queue/page.tsx`
**Status**: Untouched. Still has old RiskGate design — Lucide icons, emerald/amber/rose colors, rounded-2xl cards, `bg-muted/40`, old operator names (Acme Transport, Northern Freight, Highway Haulage).

**What it needs**:
- No layout file exists — either create one with the topbar (different branding for NTI engineer view vs. operator view) or keep it self-contained with its own header
- Replace Lucide icon imports with Docket equivalents or remove
- Replace `Logo href="/queue"` header with a Docket-styled engineer header (double-rule, "NTI Risk Engineering" label)
- Replace rounded card metrics with the ledger grid pattern (gap-px border, `bg-paper-raised`)
- Replace rounded-2xl table wrapper with the Docket table component (`<Table>` from `ui/table.tsx`)
- Update operator names to match `operators.ts`: Halloran Haulage, Tanami Freight Lines, Coalfields Carriers
- Replace emerald/amber/rose hardcoded colors with `tier-1`/`tier-2`/`tier-3` tokens
- Replace rounded pill filter buttons with ruled tab-style selectors
- Replace "Portfolio impact" card with Figure components or a ruled section
- Use `Reveal`/`Stagger` animation wrappers
- Use Docket color tokens throughout
- ~234 lines, single page

### 3. Custom 404 page — `src/app/not-found.tsx`
**Status**: Does not exist.

**What it needs**:
- Create `src/app/not-found.tsx` using the `EmptyState` component
- Docket styling: grain overlay visible, Fraunces heading, mono reference text
- Link back to `/` (marketing) and `/dashboard` (if logged in)

### 4. Privacy & Terms pages
**Status**: Do not exist. Marketing page footer links to `/privacy` and `/terms` but no pages exist.

**What it needs**:
- `src/app/(marketing)/privacy/page.tsx` — Placeholder legal page with Docket styling
- `src/app/(marketing)/terms/page.tsx` — Placeholder legal page with Docket styling
- Could be minimal: Fraunces heading, body text explaining this is a demonstration product, not real legal terms

### 5. Build verification
**Status**: Not yet run.

**What to check**:
- `npx tsc --noEmit` — typecheck
- `npx next lint` — lint
- `npx next build` — production build
- Manually verify every route renders without hydration errors in the browser
- Check that the `motion` package is in `package.json` dependencies (it was added during the redesign)
- Check that Fraunces, Archivo, JetBrains Mono all load correctly

### 6. Nothing is committed
**Status**: All changes are unstaged working-tree modifications. Nothing has been committed. Run `git status` to see the full diff — it's roughly 30+ files modified/added.

---

## File map

```
src/
├── app/
│   ├── globals.css              ✅ Docket design system
│   ├── layout.tsx               ✅ Root layout (3 fonts, grain, metadata)
│   ├── icon.svg                 ✅ Favicon
│   ├── opengraph-image.tsx      ✅ OG image
│   ├── not-found.tsx            ❌ MISSING
│   ├── (marketing)/
│   │   ├── page.tsx             ✅ Landing page
│   │   ├── privacy/page.tsx     ❌ MISSING
│   │   └── terms/page.tsx       ❌ MISSING
│   ├── (auth)/
│   │   └── login/page.tsx       ✅ Login
│   ├── (operator)/
│   │   ├── layout.tsx           ✅ Skeleton loading
│   │   ├── dashboard/page.tsx   ✅ Dashboard
│   │   ├── fleet/page.tsx       ✅ Fleet register
│   │   ├── audits/page.tsx      ✅ Audit history
│   │   ├── audits/[id]/page.tsx ✅ Audit detail
│   │   ├── premium/page.tsx     ✅ Premium breakdown
│   │   └── audit/new/page.tsx   ❌ OLD DESIGN — needs full rewrite
│   └── (engineer)/
│       └── queue/page.tsx       ❌ OLD DESIGN — needs full rewrite
├── components/
│   ├── logo.tsx                 ✅
│   ├── motion.tsx               ✅
│   ├── figure.tsx               ✅
│   ├── photo-plate.tsx          ✅
│   ├── tier-split.tsx           ✅
│   ├── tier-badge.tsx           ✅
│   ├── operator-topbar.tsx      ✅
│   └── ui/
│       ├── button.tsx           ✅
│       ├── badge.tsx            ✅
│       ├── card.tsx             ✅
│       ├── input.tsx            ✅
│       ├── dialog.tsx           ✅
│       ├── table.tsx            ✅
│       ├── progress.tsx         ✅
│       ├── label.tsx            ✅
│       ├── textarea.tsx         ✅
│       ├── skeleton.tsx         ✅
│       ├── empty-state.tsx      ✅
│       └── field-error.tsx      ✅
└── lib/
    ├── data/
    │   ├── operators.ts         ✅
    │   └── questionnaire.ts     (unchanged, still works)
    └── operator-store.tsx       ✅
```

---

## Key patterns to follow when finishing

1. **Color tokens** — Use `bg-paper`, `text-ink`, `text-ink-muted`, `text-ink-faint`, `border-rule`, `border-rule-strong`, `bg-paper-raised`, `bg-paper-sunk`. Never use shadcn semantic tokens (`bg-card`, `text-foreground`, `border-border`).

2. **Section headings** — `<p className="field-label">TRACKED CAPS LABEL</p>` above a Fraunces `<h1>` or `<h2>`.

3. **Numbering** — `<span className="font-mono text-xs text-ink-faint">01</span>` for step counters.

4. **Dotted leaders** — `border-b border-dotted border-rule-strong` spans between label and value.

5. **Double rules** — `border-t-[3px] border-double border-rule-strong` for section dividers.

6. **Mono figures** — `font-mono tabular-nums tracking-[-0.04em]` for financial/statistical numbers.

7. **Animations** — Wrap sections in `<Reveal>` with increasing `delay` (0, 0.08, 0.12, 0.16...). Use `<Stagger>`/`<StaggerItem>` for lists.

8. **Empty states** — Use `<EmptyState>` component with title, body, and optional action button.

9. **No Lucide icons** — Use mono text arrows (`←`, `→`, `↑`, `↓`), accent-colored squares (`<span className="size-1.5 bg-accent">`), or inline SVG. The redesign removed all Lucide usage from completed pages.

10. **Plate pattern** — `.plate > .plate-core` for premium/elevated surfaces (defined in globals.css).

---

## Priority order

1. **Guided audit flow** — largest remaining piece, core product flow
2. **Engineer queue** — important for NTI-facing demo
3. **Build verification** — catch type errors and lint issues
4. **404 page** — quick, uses existing EmptyState
5. **Privacy/Terms** — placeholder pages, lowest priority
