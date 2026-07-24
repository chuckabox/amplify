# RiskGate MVP

A tiered risk-audit platform that lets NTI's three engineers cover 10x more transport operators by only physically visiting audits that actually need a human.

**Status**: 🟢 **Phase 1 Complete** (UI/UX Overhaul & Scaffolding)  
**Timeline**: 24-36 hours total hackathon build (4 hours complete)  
**Team**: 3 developers (Dev A: Capture/Vision, Dev B: Triage/API, Dev C: Dashboards/Polish)

---

## 📋 Quick Navigation

### 📖 Planning & Strategy
- **[docs/nti-riskgate-plan.md](docs/nti-riskgate-plan.md)** — Full strategy, business model, and competitive positioning
- **[docs/nti-riskgate-implementation.md](docs/nti-riskgate-implementation.md)** — Hour-by-hour build plan with acceptance tests
- **[SETUP.md](SETUP.md)** — Project setup guide and development roadmap

### 🎨 UI Components
- Landing page: `src/app/(marketing)/page.tsx` — Premium dark theme with hero, features, scaling math
- Operator dashboard: `src/app/(operator)/dashboard/page.tsx` — Policy overview and audit CTA
- Engineer queue: `src/app/(engineer)/queue/page.tsx` — Audit metrics and portfolio analytics

### 🛠️ Tech Stack
- **Web**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **Components**: shadcn/ui (9 components pre-installed)
- **Icons**: Lucide React
- **Build**: TypeScript strict mode, ESLint
- **Target**: Mobile/tablet/desktop responsive

---

## 🚀 Quick Start

### Installation
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:3000` to view:
- Landing page (dark theme, hero section)
- Operator dashboard (light theme)
- Engineer queue (light theme)

### View Documentation
```bash
# Read the full strategy
cat docs/nti-riskgate-plan.md

# Read the implementation plan
cat docs/nti-riskgate-implementation.md

# Read setup guide
cat SETUP.md
```

---

## 📊 Project Phases

### ✅ Phase 1: UI/UX Overhaul & Scaffolding (COMPLETE)
- [x] Next.js 15 with App Router scaffolded
- [x] Tailwind CSS v4 + shadcn/ui configured
- [x] Route groups created (operator, engineer, marketing)
- [x] Landing page with premium design
- [x] Operator dashboard mockup
- [x] Engineer queue mockup
- [x] All pages responsive and type-safe

**Deliverables**: Clean UI, zero TypeScript errors, production build passes

---

### 📋 Phase 2: Auth & Database (Hours 2-6) — NEXT UP

**Tasks**:
- [ ] Set up Supabase PostgreSQL project
- [ ] Implement magic link authentication
- [ ] Create user roles (operator, engineer, admin)
- [ ] Build database schema (tenant, operator, audit, submission, triage_result, finding)
- [ ] Set up Row Level Security (RLS)
- [ ] Create middleware for route protection
- [ ] Seed demo data with 3 operators

**Key Files to Create**:
- `lib/supabase/server.ts` — Server-side Supabase client
- `lib/supabase/client.ts` — Client-side Supabase client
- `middleware.ts` — Auth middleware
- `supabase/migrations/0001_init.sql` — Database schema
- `supabase/seed.sql` — Demo data
- `.env.local.example` — Environment template

**Acceptance Test**: Login as operator and engineer, see correct dashboards with seeded data

---

### 📸 Phase 3: Capture & Vision (Hours 6-14)

**Tasks**:
- [ ] Build guided audit capture form with camera
- [ ] Implement Supabase Storage integration
- [ ] Create upload flow with signed URLs
- [ ] Integrate Google Gemini 2.0 Flash vision API
- [ ] Display vision analysis results
- [ ] Calculate trust signals from metadata

**Key Files**:
- `app/(operator)/audit/[id]/capture/page.tsx`
- `lib/gemini.ts`
- `app/api/upload-url/route.ts`
- `app/api/vision/analyse/route.ts`

**Acceptance Test**: Capture 3 photos on phone, see vision tags analyzed, GPS recorded

---

### 🤖 Phase 4: Triage Engine (Hours 14-22) — THE CORE

**Tasks**:
- [ ] Implement trust signals (EXIF, GPS, timestamps)
- [ ] Create hard-gate rules
- [ ] Integrate Groq Llama 3.3 LLM scoring
- [ ] Build tier routing logic
- [ ] Draft findings for escalated audits

**Key Files**:
- `app/api/triage/[submissionId]/route.ts`
- `lib/triage/trust.ts`
- `lib/triage/rules.ts`
- `lib/triage/score.ts`
- `lib/prompts/triage_v1.md`

**Acceptance Test**: Submit 3 audits, see correct tier routing (Tier 1/2/3)

---

### 📊 Phase 5: Dashboards & Features (Hours 22-28)

**Tasks**:
- [ ] Complete engineer queue with realtime updates
- [ ] Build findings editor
- [ ] Implement sign-off workflow
- [ ] Add portfolio analytics
- [ ] Create operator audit history

**Key Files**:
- `app/(engineer)/audit/[id]/review/page.tsx`
- `app/(engineer)/portfolio/page.tsx`
- `app/(operator)/audit/[id]/findings/page.tsx`
- API endpoints for findings, audits, benchmarks

**Acceptance Test**: Engineer can review, edit, and sign off on escalated audits

---

### ✨ Phase 6: Polish & Demo (Hours 28-36)

**Tasks**:
- [ ] Mobile testing (iPhone Safari, Android Chrome)
- [ ] Prompt tuning and LLM caching
- [ ] Demo data seeding
- [ ] Fallback video recording
- [ ] Pitch deck (4 slides)
- [ ] Rehearsal (under 3 minutes)

**Acceptance Test**: Full demo works on stage, all tiers demonstrated, <10s end-to-end

---

## 🎯 The Core Pitch (In 1 Sentence)

"Three submissions in, one engineer visit out" — using AI triage to route 70% of audits to auto-clear, 20% to remote verification, and only 10% to in-person visits, letting 3 engineers cover what would take 30.

---

## 📁 Project Structure

```
riskgate/
├── README.md                           # This file
├── SETUP.md                            # Development setup guide
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript config
├── tailwind.config.ts                  # Tailwind customization
├── next.config.ts                      # Next.js config
│
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx               # ✅ Landing page
│   │   │   └── layout.tsx
│   │   ├── (operator)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx           # ✅ Operator portal
│   │   │   ├── audit/[id]/
│   │   │   │   ├── capture/           # TODO: Capture form
│   │   │   │   └── findings/          # TODO: Findings view
│   │   │   └── layout.tsx
│   │   ├── (engineer)/
│   │   │   ├── queue/
│   │   │   │   └── page.tsx           # ✅ Engineer queue
│   │   │   ├── audit/[id]/
│   │   │   │   └── review/            # TODO: Audit review
│   │   │   ├── portfolio/             # TODO: Analytics
│   │   │   └── layout.tsx
│   │   ├── api/                       # TODO: API routes
│   │   ├── globals.css                # ✅ Tailwind styles
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/                        # ✅ shadcn/ui (9 components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── table.tsx
│   │   │   └── dialog.tsx
│   │   ├── shared/                    # TODO: Shared components
│   │   └── audit/                     # TODO: Audit-specific components
│   │
│   └── lib/
│       ├── supabase/                  # TODO: Supabase clients
│       ├── triage/                    # TODO: Triage engine
│       ├── gemini.ts                  # TODO: Vision API wrapper
│       ├── groq.ts                    # TODO: LLM wrapper
│       ├── prompts/                   # TODO: LLM prompts
│       └── utils.ts                   # ✅ Utilities
│
├── public/                            # Static assets
│
├── docs/
│   ├── nti-riskgate-plan.md          # ✅ Strategy & business model
│   ├── nti-riskgate-implementation.md # ✅ Hour-by-hour build plan
│   └── old/                           # Archived planning docs
│
└── supabase/                          # TODO: Database
    ├── migrations/                    # TODO: Schema
    └── seed.sql                       # TODO: Demo data
```

---

## 🎨 Design System

### Colors
- **Primary**: Blue (`#2563eb`) / Cyan (`#06b6d4`)
- **Success**: Green (`#16a34a`)
- **Warning**: Yellow (`#eab308`) / Orange (`#ea580c`)
- **Neutral**: Slate (50-950)

### Typography
- **Headlines**: Bold, tracked tight
- **Body**: Regular, readable line-height
- **Small**: Muted color for secondary info

### Components
- Card-based layouts with hover effects
- Gradient accents for premium feel
- Icons from Lucide React
- Responsive breakpoints (mobile-first)

---

## 🔐 Environment Setup

Create `.env.local` (copy from `.env.local.example`):

```bash
# Supabase (Phase 2)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# LLM APIs (Phase 3-4)
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧪 Testing Checklist

### Phase 1 (Current)
- [x] Build passes TypeScript strict mode
- [x] Dev server starts without errors
- [x] All pages render correctly
- [x] Responsive design works (mobile/tablet/desktop)
- [x] Production build succeeds

### Phase 2 (Next)
- [ ] Auth flow works (magic link)
- [ ] User roles route correctly
- [ ] Database seeded with demo data

### Phase 3
- [ ] Camera input works on phone
- [ ] Vision API responds correctly
- [ ] Upload flow completes

### Phase 4
- [ ] Triage pipeline runs end-to-end
- [ ] Correct tier routing
- [ ] LLM scoring reasonable

### Phase 5-6
- [ ] All dashboards functional
- [ ] Engineer sign-off works
- [ ] Demo runs under 10 seconds

---

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Mobile browsers (iOS 14+, Android 10+)

---

## 🚨 Key Constraints

1. **Zero NTI system integration for MVP** — No SSO, no internal tools
2. **Mobile-first** — Capture screen must work on phone
3. **Human sign-off required** — AI never issues adverse outcomes alone
4. **Bad-faith defense** — Assume operators might game the system
5. **<10 second triage** — Must route in reasonable time for UX

---

## 📞 Questions?

### Where's the strategy?
→ Read `docs/nti-riskgate-plan.md`

### How do I build the next phase?
→ Read `docs/nti-riskgate-implementation.md` and `SETUP.md`

### What's the current status?
→ This README (updated weekly)

### Which files did I just change?
```bash
git status
git diff
git log -5
```

---

## 🎯 Success Criteria (End of Hackathon)

1. ✅ Vercel deployment loads on any network
2. ✅ Three demo users can log in
3. ✅ New audit submitted end-to-end from phone routes correctly
4. ✅ Three pre-seeded audits in engineer queue with correct tiers
5. ✅ Engineer can sign off escalated audit, operator portal reflects it
6. ✅ Fallback video exists and plays
7. ✅ 4-slide pitch rehearsed under 3 minutes
8. ✅ Team knows Q&A answers

---

**Last Updated**: 2026-07-25  
**Built By**: Team RiskGate  
**Status**: Phase 1 Complete → Ready for Phase 2
