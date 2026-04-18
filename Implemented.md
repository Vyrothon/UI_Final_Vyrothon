# ClearClaim AI — Implemented vs. planned

**Last reviewed:** 2026-04-18 (manual). Update after each shipped slice.

This file tracks the **[README.md](./README.md)** business plan and **[Implementation.md](./Implementation.md)** technical plan against **this repository**.

---

## Implemented (today)

- **Next.js** App Router app (`npm run dev` / `build` / `start`).
- **Marketing site** with medical billing / audit narrative (hero, FAQ, testimonials, features, integrations copy).
- **Static SEO** / structured data oriented toward bill auditing (verify brand, domain, and claims for production).
- **Newsletter** API route (if env configured) — not part of core ClearClaim flows.
- **Documentation:** README (business plan), Implementation.md (systems plan), this file.

---

## Not implemented (gaps vs. business plan)

### Core product

| Capability | Status |
|------------|--------|
| Sign-up with **country** + payment method routing | Not built |
| **Stripe** subscriptions (Pro / Family) + usage limits | Not built |
| Bill + **discharge summary** upload | Not built |
| **Claude Vision** (or other) structured ingest | Not built |
| **Government rate** DB + country fallback (pattern-only) | Not built |
| **Audit API** + Zod-validated `AuditResult` | Not built |
| Report dashboard (original vs fair vs overcharge) | Not built |
| **Option A** dispute letter + PDF + tier gating | Not built |
| **Option B** paralegal workflow + agreements + queue | Not built |
| **Option C** legal marketplace + ranking + **$400** intake + **6%** | Not built |
| Firm **24h SLA** + auto-delisting | Not built |
| Resolution tracking + **45-day** follow-up | Not built |
| **15% / $149 min** success fee automation | Not built |
| **Hospital aggregation** (10 in 30 days) + group path | Not built |
| **Medication check** (FDA) + mandatory disclaimers | Not built |
| **90-day** retention cron + long-storage opt-in | Not built |
| Razorpay / non-US payment phase | Not built |
| Enterprise B2B audit API (Phase 3) | Not built |

### Infrastructure

| Capability | Status |
|------------|--------|
| Supabase auth + tables per Implementation.md | Not in repo |
| pgvector rate matching | Not in repo |
| Country config service | Not in repo |

---

## Suggested next commits (aligned with README)

1. `lib/types/` — `BillDocument`, `AuditResult`, `CountryConfig`, `SubscriptionTier`.  
2. `app/api/audit` — mock JSON → Claude + Zod.  
3. `app/(app)/dashboard` — report UI from mock audit.  
4. Supabase migrations from **Implementation.md §7**.  
5. Stripe products + webhook + `usage_counters` for **1 free scan / month**.  
6. `app/api/dispute-letter` + pdf-lib + **Pro gate**.  
7. Marketplace read model + `referrals` insert (no payments yet).

---

## Compliance reminders (for implementers)

- **Rule 9:** Not a law firm — footers and marketplace copy in **every** flow.  
- **Rule 8:** Medication flags — informational only; no liability claims.  
- **Rule 7:** Retention and deletion — implement before public PHI.  
- **Rules 4, 11:** Referral economics — **legal ethics review** before any real money moves.

---

## Disclaimer

ClearClaim assists with **analysis and document preparation** and **referrals** to independent professionals. It does not provide legal or medical advice. Judges and investors should see **sourced** statistics, not uncited global fraud totals.
