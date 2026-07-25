# Simplify: one flow, no roles

Strip the two-role product (operator portal + engineer queue) down to a single
public flow.

**Route map after:** `/` (landing) → `/audit` → done. That's it. No login, no
dashboard, no queue, no persistence.

Decisions locked:

| Question | Answer |
|---|---|
| Summary shows | Score + findings only. No premium, no dollars. |
| Upload | One big dropzone for everything. |
| State | Ephemeral. No localStorage, refresh starts over. |
| Landing | Same page and copy, one CTA instead of the role split. |

---

## 1. Delete

```
src/app/(auth)/                        login
src/app/(engineer)/                    layout, queue, queue/[id], portfolio
src/app/(operator)/layout.tsx          auth guard
src/app/(operator)/dashboard/
src/app/(operator)/fleet/
src/app/(operator)/premium/
src/app/(operator)/audits/             list + [id]
src/lib/operator-store.tsx             context + localStorage
src/lib/data/engineer.ts
src/components/operator-topbar.tsx
src/components/engineer-topbar.tsx
src/components/operator-tour.tsx       already dead — nothing imports it
src/components/figure.tsx
src/components/hint.tsx
src/components/tier-badge.tsx
src/components/ui/{dialog,field-error,input,label,table,textarea,skeleton,badge,card,progress}.tsx
```

Keep `tier-split.tsx` — the landing page still uses it.

`ui/empty-state.tsx` is used by `src/app/not-found.tsx`. Keep it, or inline the
~10 lines and delete. Either is fine.

`OperatorProvider` comes out of `src/app/layout.tsx`.

## 2. Slim the domain data

`src/lib/data/operators.ts` → rename `src/lib/data/audit.ts`.

Keep: `Pillar`, `PILLAR_LABEL`, `Finding`, `FindingStatus`,
`FINDING_STATUS_LABEL`, `formatDate`.

Delete: `Vehicle`, `VehicleType`, `VEHICLE_BASE_RATE`, `Operator`, `Audit`,
`AuditStatus`, `FORCED_TIER`, `TIER_MEANING`, `INITIAL_OPERATORS` (~370 lines of
seed fleets), and all premium maths (`fleetBasePremium`, `riskMultiplier`,
`mileageLoading`, `computePremium`, `nextAuditDue`, `totalOdometer`,
`addMonths`, `daysUntil`, `formatCurrency`).

## 3. Real scoring, replacing the forced tiers

New `src/lib/score.ts`. The questionnaire already carries a real `riskWeight`
(1 best … 5 worst) on every option — use it instead of the per-fleet
`FORCED_TIER` lookup, which has nothing to key off now that login is gone.

```
score    = mean riskWeight across all 12 answers        → 1..5
finding  = per pillar, worst answered weight
             >= 4  → action    ("Needs fixing")
             == 3  → advisory  ("Keep an eye on")
             else  → clear     ("Good")
outcome  = score < 2.5  → cleared on evidence
           score < 3.5  → remote video verification
           else         → site visit
```

`src/lib/score.check.ts` — assert-based self-check, run with
`node src/lib/score.check.ts` (Node 25 strips TS natively, no dependency).
Wired as `npm run check`. Three cases:

- all-best answers → `cleared`, every finding `clear`
- all-worst answers → `site visit`
- one bad pillar only → that pillar `action`, the rest `clear`

## 4. The audit flow

Move `src/app/(operator)/audit/new/page.tsx` → `src/app/audit/page.tsx`.
Steps `0..7` collapse to `0..7` with the same shape but less in them:

- **0 intro** — keep. Strip the fleet/policy copy. Cancel → `/`.
- **1–4 pillars** — unchanged. They already work standalone.
- **5 upload** — rewritten. One square dropzone: `onDragOver` / `onDrop` plus a
  hidden `<input type="file" accept="image/*,video/*" multiple>` behind a click
  handler. Thumbnail grid below, `<video>` element for video mime types,
  remove-on-hover. Evidence state flattens from `Record<string, Preview[]>` to
  a single `Preview[]`. The four evidence labels from `QUESTIONNAIRE` render as
  hint text above the square, so people know what to shoot.
- **6 analysing** — keep the staged animation. Drop the "Uploading your photos"
  stage when zero files were dropped.
- **7 summary** — score out of 5, outcome band, per-pillar findings with their
  status labels, photo count. No premium block, no policy number, no "see full
  audit record" link. Buttons: *Start another* / *Back home*.

Progress bar stays 5 segments (4 pillars + upload).

## 5. Landing page

`src/app/(marketing)/page.tsx` — all sections and copy stay.

- Hero: `I run a fleet` + `I'm a risk engineer` → one `Start an audit` → `/audit`
- Header: `Sign in` + `Start an audit` → one `Start an audit`
- Closing block: same, drop `See the engineer queue`
- Footer: drop `Operator portal` and `Engineer queue`, keep Privacy / Terms

The `(marketing)` route group ends up holding only the landing page, privacy and
terms. Leave it — moving it buys nothing.

---

## Net

~2,400 lines deleted, ~150 written.

Static export gets simpler for free: no dynamic routes survive, so the
`generateStaticParams` stubs die along with `audits/[id]` and `queue/[id]`.
