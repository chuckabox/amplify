# RiskGate MVP Setup Guide

## ✅ Completed (Phase 1: UI Overhaul & Scaffolding)

### Project Initialization
- [x] Next.js 15 with App Router scaffolded
- [x] TypeScript configured
- [x] Tailwind CSS v4 integrated
- [x] shadcn/ui components installed (button, card, input, label, textarea, badge, progress, table, dialog)
- [x] Lucide React icons for premium iconography
- [x] Route groups structure created: (operator), (engineer), (marketing)

### UI Design & Components
- [x] **Landing Page** (`src/app/(marketing)/page.tsx`)
  - Premium dark theme with gradient backgrounds
  - Hero section with compelling copy
  - Feature grid with hover effects
  - Scaling math visualization (3 engineers → 30 coverage)
  - Clear CTAs for both user types
  - Responsive design (mobile, tablet, desktop)

- [x] **Operator Dashboard** (`src/app/(operator)/dashboard/page.tsx`)
  - Policy overview cards (fleet size, premium, mileage, audit due)
  - Premium main CTA for guided audit
  - Recent audit summary with tier indicators
  - Risk score visualization
  - Clean typography and spacing

- [x] **Engineer Queue** (`src/app/(engineer)/queue/page.tsx`)
  - KPI metrics: submissions, auto-cleared, video verified, visits needed
  - Active queue table with audit details and action buttons
  - Tier-based badges (Tier 1 green, Tier 2 yellow, Tier 3 orange)
  - Portfolio impact summary (hours saved, distances avoided, throughput multiplier)
  - Hover effects and interactive elements

### Design System
- Color palette: Slate (neutral), Blue/Cyan (primary), Green (success), Yellow/Orange (warning)
- Tailwind spacing, typography, and responsive breakpoints
- Gradient overlays for premium feel
- Card-based layouts with hover states
- Icons for visual hierarchy (Lucide React)
- Dark mode landing page, light mode dashboards

## 🚀 Next Steps (Phase 2-6)

### Phase 2: Authentication & Database (Hours 2-6)
1. Set up Supabase project (PostgreSQL + RLS)
2. Implement magic link auth with Supabase Auth
3. Create user roles (operator_user, nti_engineer, nti_admin)
4. Create database migrations (see nti-riskgate-implementation.md section 5)
5. Add middleware for route protection
6. Seed demo data with three operators

### Phase 3: Capture Screen & Vision (Hours 6-14)
1. Build guided audit capture form (`app/(operator)/audit/[id]/capture`)
2. Implement camera input with `<input type="file" capture="environment">`
3. Create Supabase Storage bucket for evidence uploads
4. Wire signed URL generation via API route
5. Integrate Google Gemini 2.0 Flash for vision analysis
6. Display vision results and confidence scores

### Phase 4: Triage Engine (Hours 14-22)
1. Create triage API route: `POST /api/triage/[submissionId]`
2. Implement trust signals (EXIF, GPS, timestamps, workshop attestation)
3. Create hard-gate rules (missing mandatory items, low trust → forced Tier 2/3)
4. Integrate Groq Llama 3.3 70B for LLM scoring
5. Score per pillar against NTI standards
6. Route to appropriate tier based on risk

### Phase 5: Dashboards & Features (Hours 22-28)
1. Build findings editor for engineers
2. Add realtime updates via Supabase Realtime
3. Implement sign-off workflow
4. Create portfolio analytics and benchmarks
5. Add operator findings view and remediation tracker

### Phase 6: Polish & Demo (Hours 28-36)
1. Empty states and loading skeletons
2. Error handling and network resilience
3. Mobile testing (iPhone Safari, Android Chrome)
4. Prompt tuning for vision and LLM models
5. Demo data seeding with realistic scenarios
6. Fallback video recording
7. Pitch deck and rehearsal

## 📦 Environment Setup

### Local Development
```bash
cd /Users/siddhant/Desktop/hackathon/qut\ amplify/riskgate

# Install dependencies (already done)
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

Visit `http://localhost:3000` for landing page

### Required Environment Variables (see Phase 2)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# LLM APIs
GROQ_API_KEY=gsk_xxx
GEMINI_API_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Project Structure

```
riskgate/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx           # Landing page ✅
│   │   │   └── layout.tsx
│   │   ├── (operator)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx       # Operator portal ✅
│   │   │   ├── audit/[id]/
│   │   │   │   ├── capture/       # Capture screen (TODO)
│   │   │   │   └── findings/      # Findings view (TODO)
│   │   │   └── layout.tsx
│   │   ├── (engineer)/
│   │   │   ├── queue/
│   │   │   │   └── page.tsx       # Engineer queue ✅
│   │   │   ├── audit/[id]/
│   │   │   │   └── review/        # Audit review (TODO)
│   │   │   ├── portfolio/         # Portfolio analytics (TODO)
│   │   │   └── layout.tsx
│   │   ├── api/                   # API routes (TODO)
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components ✅
│   │   ├── shared/                # Shared components (TODO)
│   │   └── audit/                 # Audit-specific components (TODO)
│   └── lib/
│       ├── supabase/              # Supabase clients (TODO)
│       ├── gemini.ts              # Vision model wrapper (TODO)
│       ├── groq.ts                # LLM wrapper (TODO)
│       └── utils.ts               # Utilities
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## 🎨 Design Decisions

1. **Dark theme for marketing, light for apps**: High-contrast landing page for conversion, clean dashboards for functionality
2. **Gradient accents**: Premium feel without overwhelming UI
3. **Icon-based navigation**: Lucide React for consistency
4. **Card-based layouts**: Clear information hierarchy
5. **Responsive first**: Mobile capture is critical for operators
6. **Tailwind only**: No additional CSS libraries for speed

## 📝 Key Files to Understand

- `nti-riskgate-plan.md`: Full strategy and business model
- `nti-riskgate-implementation.md`: Hour-by-hour build plan
- `src/app/(marketing)/page.tsx`: Example of premium design pattern
- `src/app/(operator)/dashboard/page.tsx`: Dashboard design pattern
- `tailwind.config.ts`: Tailwind customization (if any)

## 🔗 External Resources

- **Supabase Docs**: https://supabase.com/docs
- **Groq API**: https://console.groq.com/docs
- **Google Gemini**: https://ai.google.dev
- **Next.js 15 Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

---

**Last Updated**: 2026-07-25  
**Status**: Phase 1 Complete - Ready for Phase 2 (Auth & Database)
