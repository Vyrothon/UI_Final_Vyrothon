# ClearClaim AI — Pitch Deck (Gamma source)

**Use this file in Gamma.ai** as the outline/script. Each `##` block is one slide. *Italic lines* are optional speaker notes or Gamma image hints.

---

## ClearClaim AI

**Medical bill intelligence: audit, dispute, recover — at scale.**

SDG 3 · Good health & well-being · SDG 10 · Reduced inequalities

*One-liner for Gamma cover: modern healthcare + document scan aesthetic, trust-forward (not “get rich quick”).*

---

## The problem

Hospital bills are **designed to be unreadable** at the worst possible moment.

- Patients face **walls of line items**, opaque codes, and no fair-price reference.
- **Billing errors and fraud patterns** (upcoding, unbundling, duplicates, phantom charges, extreme markups) are common — but **fewer than 3%** of patients dispute, per many markets’ consumer surveys.
- **No time, no leverage, no process** → billions in overpayments and stress.

*Avoid uncited “trillions” claims in live pitch; cite FBI / industry sources where you use US fraud percentages.*

---

## Who hurts most

| Segment | Why it matters |
|--------|----------------|
| **US insured & private pay** | EOB complexity, surprise billing history, CPT/ICD literacy gap |
| **Emerging markets (e.g. Pakistan)** | Weak price transparency, limited audit culture, **20–40% estimated overcharge** in some private-hospital reporting |
| **Everyone post-discharge** | Exhausted, scared — the system optimizes for payment, not clarity |

*Gamma visual: split map or two columns — “opacity” vs “clarity.”*

---

## Our insight

**Complexity is the moat — until software reads the bill like a billing expert.**

Give patients three things they lack today:

1. **Reference** — structured line items + benchmarks where data exists  
2. **Voice** — dispute-ready letters and escalation paths  
3. **Leverage** — optional human dispute help + **vetted legal marketplace**

---

## What ClearClaim does

**Upload a bill → get an audit → pick an action.**

- **AI audit** — OCR/vision, line-item extraction, fraud-pattern flags, estimated fair total vs. billed  
- **Dispute package** — formal letters with citations where rate data exists; **pattern-only mode** with clear disclaimers when it doesn’t  
- **Resolution rails** — self-serve dispute, **in-house paralegal path**, or **attorney marketplace** with pre-packaged intake  
- **Trust path** — when the bill looks **clean**, we say so (**clean-bill / verified framing** in product vision)

*Legal disclaimer on every artifact: ClearClaim is **not a law firm**; not medical or legal advice.*

---

## Product flow (simple)

1. **Sign up** — country drives templates, partners, payments, compliance mode  
2. **Upload** — photo/PDF, ~30s target  
3. **Audit** — AI cross-checks line items vs. **published rates** where available; flags anomalies  
4. **Report** — “You were billed X · fair estimate Y · delta Z”  
5. **Act** — letter PDF, optional managed dispute, lawyer match  
6. **Track** — status, outcomes, fees per rules  

*Gamma: 6-step horizontal timeline or funnel.*

---

## Why now

- **Multimodal LLMs + vision** make consumer-grade document understanding feasible  
- **Global anger** at healthcare costs and opacity — willingness to try tools  
- **Stripe-class payments + Supabase-class backends** → small team can ship trust-sensitive workflows  
- **Regulatory attention** on transparency creates tailwind (position as **pro-consumer clarity**, not adversarial chaos)

---

## Business model

| Stream | Summary |
|--------|---------|
| **Subscriptions** | ~**$9.99/mo** Pro (unlimited scans, letter, marketplace); **~$19.99/mo** family (e.g. up to 6 members) |
| **Success fees** | **15% of recovered** on managed dispute path, **$149 minimum** — *jurisdiction + ethics review required* |
| **Legal marketplace** | **$400 per intake** + **6% contingency** on wins (or firm not listed); group-case path with separate economics |
| **Document upsells** | Premium packs, filings — **~$29–$99** one-time |
| **B2B (phase)** | Hospital/insurer **audit API** — **$2k–5k/mo** compliance-oriented positioning |

*Gamma: simple stacked bar “revenue mix by phase.”*

---

## Go-to-market (phased)

| Phase | Focus |
|-------|--------|
| **Months 1–3** | **US** — seed **~30** billing/med-mal firms across key states; community acquisition (Reddit, patient forums); free listings window |
| **Months 4–6** | **India** — ombudsman / consumer-court letter variants; local payments |
| **Months 7–12** | **UAE, UK** — expat insurance confusion; private-pay growth |
| **Year 2+** | Expand as **rate datasets + counsel networks** allow |

---

## Moat & defensibility (honest)

- **Country-specific playbooks** — templates, partners, compliance modes  
- **Outcome and network data** — marketplace ranking (win rate, recovery, SLA — **firms can’t buy rank**)  
- **Workflow + trust UX** — retention, not one-off “chat PDF”  
- **Enterprise API** later — distribution inside institutions  

*Avoid claiming “proprietary CPT database” unless you’ve built or licensed it.*

---

## Traction & milestones (edit with your real numbers)

- **Now:** Marketing + auth foundation; product spec aligned with revenue design  
- **Next 90 days:** Bill upload → audit demo → PDF letter → first **design partners** / pilot hospitals or patient advocates  
- **Metrics to show when you have them:** activation rate, $ estimated flagged, letters sent, recovery self-reports, NPS  

*Replace this slide entirely with your actual deck numbers before investors.*

---

## Competition (positioning)

| Type | ClearClaim angle |
|------|------------------|
| **DIY articles / templates** | No structure, no benchmarks, no escalation |
| **Lawyers alone** | High friction, slow intake, patient can’t prep the file |
| **Generic “AI PDF chat”** | No billing rules, no marketplace, no compliance posture |
| **Incumbent revenue-cycle vendors** | B2B-first; we’re **patient-first** with optional B2B API |

---

## Tech (credible, high level)

- **Web:** Next.js (App Router), Tailwind  
- **Auth & data:** **Supabase** (Postgres, Auth, Storage)  
- **AI:** Multimodal audit + JSON-structured outputs; fast models for latency-sensitive steps  
- **Search / similarity:** pgvector for near-duplicate line items (roadmap-aligned)  
- **Deploy:** Vercel + Supabase  

*Gamma: simple architecture diagram — Upload → Audit → Documents → Marketplace.*

---

## Risk & compliance (show you’re serious)

- **Not a law firm** — disclosures on every output; marketplace is **introduction**, not representation  
- **Privacy** — short default retention (e.g. **90-day** doc deletion unless opt-in); align HIPAA / local health law  
- **Bar & referral rules** — **state/country-specific** review before scaling referral economics  
- **Medical disclaimers** — drug/appropriateness checks are **informational only** where offered  

---

## The ask

**[Edit this slide for your audience: hackathon judges vs. angels vs. grants]**

- **Hackathon:** validation, intros to patient advocates, pilot hospital  
- **Pre-seed:** **$[X]** for US marketplace seeding + audit MVP + compliance counsel  
- **Strategic:** distribution via employers, TPAs, or consumer health apps  

**Contact:** *[your email · site · deck link]*

---

## Closing

> **“People don’t fight billing because they can’t read the paper. ClearClaim reads it for them — and gives them a path from report to recovery.”**

**ClearClaim AI** — *clarity before you pay.*

---

## Appendix — 60-second script (judges)

Hundreds of billions are lost to **billing errors and abusive patterns** each year — exact figures should be **cited**, not guessed. The average stack of charges hides **duplicates, code games, and phantom lines**. Most patients **pay anyway**.

**ClearClaim** ingests the bill, **structures the line items**, flags **fraud patterns** and **estimated overcharges**, and produces **dispute-ready documents**. If the hospital ignores them, we escalate to **managed dispute** and a **vetted attorney marketplace**.

We make money from **subscriptions**, **success fees on recovery**, and **referral economics** — with **jurisdiction-specific** legal review before we scale.

**[Demo: upload → flagged report → PDF letter → marketplace wireframe.]**

---

## Gamma tips (optional)

- **Tone:** calm, institutional trust — think “Stripe for bill clarity,” not “lawsuit lottery.”  
- **Palette:** deep teal or navy + warm accent; plenty of whitespace.  
- **Icons:** document scan, shield, scale (subtle), hospital → user arrow.  
- **Stock avoid:** fake “100% guaranteed refund” language; keep disclaimers visible in appendix if not on every slide
