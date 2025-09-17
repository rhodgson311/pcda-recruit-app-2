# PCDA Recruit App (Vercel + GitHub)

Interactive, video-call-friendly intake form and personalized pathway generator for prospective PCDA recruits. Built with **Next.js (App Router) + TypeScript + Tailwind + Zustand**.

## What’s included
- **Contact & Meeting**: Name, full address, attendees (names & emails).
- **Academics**: HS GPA, dual enrollment, # of current college classes, total credits, ACT, SAT, desired major, HS grad month/year.
- **Eligibility Visual**: ≤11 credits → Gap year; ≥12 → Redshirt / clock started.
- **Residency & FAFSA**: Residency gates FAFSA eligibility. Also asks if they plan to use FAFSA.
- **Soccer**: Desired level, academic eligibility status, NCAA eligibility number, college offers.
- **Colleges**: Multi-select from dataset (upload at `public/colleges.json`).
- **Financial Planner**: Base fee $31,750, down payment, work-hours offset, FAFSA estimate (placeholder), remaining balance.
- **Summary**: Timestamped pathway, finances, eligibility, selected colleges, action items, visit & start dates.

## Quickstart

```bash
# 1) Clone
git clone <your-repo-url> pcda-recruit-app
cd pcda-recruit-app

# 2) Install
npm i   # or yarn / pnpm

# 3) Dev
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel
Push to GitHub → Import in Vercel → Framework: **Next.js** → defaults OK.

## College Dataset
Place your full list in `public/colleges.json` matching `public/sample-colleges.json` schema. Use **/data/colleges** to preview/edit in-memory and export.

## Notes
- FAFSA amount uses a simple placeholder (editable in `lib/store.ts` → `computeFinancials`).
- Eligibility thresholds are implemented in `lib/store.ts` → `eligibilityStatus`.
- All new fields are wired into `/summary` for the family’s take-home plan.
