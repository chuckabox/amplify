# Audit Questionnaire & Premium Logic

How the operator-side guided audit is structured, why each question exists, and
how answers + evidence turn into a tier and a premium. This is the reasoning
behind [`src/lib/data/questionnaire.ts`](../src/lib/data/questionnaire.ts) and
[`src/lib/data/operators.ts`](../src/lib/data/operators.ts).

---

## 1. The mental model (and a note on framing)

**Our working assumption:** NTI insures transport operators. When an operator
takes out or renews a policy, RiskGate triggers a **guided audit**. The audit is
not busywork — it is the **risk assessment that prices the premium**. A clean
audit earns a discount; a risky one carries a loading or escalates to a human
visit before cover is confirmed.

So the flow is:

```
Apply / renew policy  →  prompted to run guided audit  →  triage scores it
   →  premium is set from the result  →  ongoing findings & remediation
```

**My perspective (worth pressure-testing with NTI):** in the real world the
audit and the premium are related but not always one instrument. NTI runs risk
*engineering* audits (safety, compliance, loss prevention) that inform
underwriting, but the premium is also driven by claims history, sums insured,
vehicle values, cargo type and excess. Two refinements worth considering:

1. **Audit → risk grade → premium modifier**, rather than audit → premium
   directly. The audit produces a risk grade; underwriting turns the grade into
   a modifier on an actuarially-set base. This keeps the audit honest (it grades
   risk) without pretending it's the whole pricing engine.
2. **Audit as a condition of cover / renewal**, not just a discount. For higher
   risk operators the audit gates whether cover is offered at all, which is a
   stronger hook than a price nudge.

For the hackathon we model the simpler, more legible version (audit directly
adjusts premium) because it demos the value in one screen. The architecture
keeps them separable, so we can split "risk grade" from "pricing" later.

---

## 2. The four pillars

Questions are grouped by NTI's four audit pillars. Each pillar has a short
"why we ask" line in the UI tying it to premium, because operators engage more
when they see the price consequence.

| Pillar | What it predicts | Premium rationale |
|---|---|---|
| People & Capability | At-fault driver incidents, fatigue events | Biggest single driver of heavy-vehicle claims |
| Asset Management | Breakdowns, brake/tyre-related collisions | Roadworthiness discipline lowers frequency |
| Emergency & Incident | Severity once an incident occurs | Preparedness caps claim size |
| Site Safety & Security | Third-party liability, theft | Load restraint & depot security drive liability/theft |

---

## 3. Question design & risk weights

Every answer option carries a **risk weight** from 1 (best practice) to 5 (high
risk). Weights are authored to line up with NTI standard clauses where one
exists (e.g. tyre tread AM-4.2.1, fire equipment EI-2.3.1, load restraint
SS-1.4.2). Examples:

- *"At what tyre tread depth do you replace?"* — `3mm+` = 1, `~2mm` = 2,
  `legal limit 1.6mm` = 3, `run until worn` = 5.
- *"When was fire equipment last inspected?"* — `<6mo` = 1, `6–12mo` = 2,
  `>12mo` = 5, `unsure` = 4.

Questions are deliberately **few and concrete** (2–3 per pillar). A long form
kills completion on mobile; we lean on evidence photos to verify the claims that
matter most.

### Why these questions and not others
- Chosen for **verifiability** — each pillar pairs its questions with a photo
  that can corroborate the self-report (tread photo, tag photo, restraint photo,
  training record). This is the anti-gaming hook: the answer and the evidence
  must agree.
- Chosen for **premium signal** — each maps to a known loss driver, so the
  weights are defensible to an underwriter.

---

## 4. Evidence

Each pillar requests one photo (video allowed). Captured on-site, photos carry
GPS + timestamp metadata used by the **trust signals** (EXIF present, GPS
clustered at one plausible site, timestamps within the audit window). Missing or
inconsistent metadata should force escalation regardless of how good the photos
look — a self-report with no verifiable evidence cannot clear at Tier 1.

Evidence is optional in the demo build so the flow is easy to walk through on
stage, but the slots and metadata story are real.

---

## 5. Scoring → tier (design intent)

```
per-question weight (1–5)
   → pillar score = weighted blend of that pillar's answers + vision findings
   → overall score = mean of pillar scores, adjusted by trust multiplier
   → tier:
        Tier 1  overall ≤ 2.0  AND trust ≥ 0.7      (auto-clear to spot-check)
        Tier 2  overall 2.1–3.5  OR trust 0.4–0.7   (request remote video)
        Tier 3  overall ≥ 3.5   OR any pillar = 5   (in-person visit)
```

**Hard gates** run before the model and can only raise a tier, never lower it:
a missing mandatory photo, an illegible photo, failed GPS/EXIF, or a critical
risk indicator forces at least Tier 2 (Tier 3 for critical). A human signs every
adverse or final outcome — the AI never disapproves cover on its own.

### Demo stub (current build)
Routing is **stubbed to always clear at Tier 1** so the operator demo is
deterministic on stage (per the hackathon plan). The real weights are still
computed and used to generate advisory-vs-clear findings, so the result reacts
to answers, but the final tier is fixed to 1. Swapping the stub for the real
model is a single function (`finalize` in the audit wizard →
`/api/triage/[submissionId]` later).

---

## 6. Premium logic

Implemented in `operators.ts`:

```
base        = Σ base rate per vehicle (Prime mover 8200, Rigid 5200,
                                       Trailer 2400, Van 1900)
riskMult    = latest audit → Tier 1: 0.90 · Tier 2: 1.12 · Tier 3: 1.40
              (un-audited applicant: 1.18 loading)
mileageLoad = ~$3,500 per 1,000,000 fleet km
premium     = round( base × riskMult + mileageLoad )
```

Consequences that make the demo feel real:
- **Add/remove a vehicle** (Fleet page) changes `base` → premium updates live.
- **Complete an audit** → latest audit becomes Tier 1 → `riskMult` drops to
  0.90 → premium falls, and the result screen shows the saving.
- **Next audit due** is derived from the last audit date + an interval that
  shortens with risk (Tier 1: 12mo, Tier 2: 9mo, Tier 3: 6mo).

---

## 7. Open decisions

- [ ] Split "risk grade" from "premium modifier" (see §1) — confirm with NTI
      which they'd actually deploy.
- [ ] Should Tier 3 gate cover/renewal, not just price it?
- [ ] Weight calibration: current weights are reasoned, not fitted. Real claims
      data would calibrate them.
- [ ] Workshop-attested submissions should apply a trust bonus in the multiplier
      (network is modelled in the plan but not yet in pricing).
