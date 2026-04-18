# ClearClaim

**SDG 3 · SDG 10** — Healthcare quality and access; reduced inequalities.

**One line:** AI that audits hospital bills, flags overcharges and billing-fraud patterns, estimates what you may legitimately owe, and helps you **negotiate**—dispute letters, follow-ups, and plain-language scripts—not just “here’s a PDF you don’t understand.”

---

## Why this exists

Medical billing in Pakistan and globally is often **opaque, asymmetric, and easy to exploit**. Hospitals use dense line items—facility fees, consumables, OT surcharges—while patients have **no reference point** and little leverage. In Pakistan’s private sector, public reporting has included cases of charges for care not delivered, drugs not given, or days not spent as an inpatient. People pay because they are scared, tired, and alone at the worst moment.

ClearClaim is not “AI reads your bill.” It is a **negotiation intelligence layer**: structured audit, fraud-pattern classification, savings framing, and **actionable** outputs (dispute drafts, tracking, what to say if billing calls).

> **Disclaimer.** ClearClaim provides analytical and educational assistance. It is **not** legal advice, medical advice, or a substitute for licensed professionals. Always verify charges with the hospital and your insurer or fund. Laws and fee schedules differ by country and facility.

---

## What makes it technically serious

Hospital bills embed **medical billing codes** (e.g. ICD-10 for diagnoses, CPT-style procedure codes where used). ClearClaim is designed to:

| Pattern | What it means |
|--------|----------------|
| **Upcoding** | A more complex (expensive) code than the service performed |
| **Unbundling** | One procedure split into many billable lines that should bundle |
| **Duplicate billing** | Same service or supply charged twice (wording or dates differ) |
| **Phantom charges** | Drugs, days, equipment, or procedures not supported by the record |
| **Excessive markup** | Charges far above reference or contracted rates where data exists |

The product cross-references extracted codes and line items against **reference rate data** (where available), runs **fraud-pattern detection**, estimates a **defensible range** for legitimate totals, and generates **structured dispute narratives**—not vague “this seems high.”

---

## Product surfaces (target)

1. **Upload** — Photo or PDF; OCR → structured line items + codes  
2. **Audit** — Single Claude (or equivalent) call over structured JSON + relevant rate context  
3. **UI** — Red/green flags, fraud type, savings estimate, dispute strength  
4. **Dispute kit** — Letter prose → **pdf-lib** PDF; optional email via **Resend / Nodemailer**  
5. **Tracking** — Claim/dispute status, reminders (future)

---

## Tech stack (planned / in progress)

| Layer | Choice |
|--------|--------|
| App | **Next.js** (App Router), API routes |
| Audit / copy | **Claude API** (structured JSON audit + letter prose) |
| OCR | **Tesseract.js** and/or **Google Cloud Vision** |
| Data | **Supabase** (Postgres + **pgvector** for code/rate semantic match) |
| PDF | **pdf-lib** |
| Mail | **Resend** or **Nodemailer** |

See **[Implementation.md](./Implementation.md)** for architecture, prompts, schema sketches, and build phases.

See **[Implemented.md](./Implemented.md)** for what this repository actually contains today.

---

## Business model (directional)

- **B2C freemium:** Free audit preview; paid tier for full dispute pack + tracking (e.g. PKR 999 framing for markets where that lands).  
- **Success fee (large bills):** Optional % of amounts successfully reduced or recovered—jurisdiction and regulations permitting.  
- **B2B — insurers:** Fraud-detection API on inbound hospital invoices (e.g. Pakistan carriers and global analogues).  
- **B2B — corporates:** Pre-pay audit for employee health benefits.

Pricing and regulated activities must be validated locally (legal, financial services, medical claims).

---

## The 3-minute demo (hackathon / pitch)

1. Show a **realistic fabricated bill** (e.g. PKR 847,000 total)—admission, OT, meds, room, **intentional phantom/unbundle lines**.  
2. **Upload** → OCR populates the table live.  
3. **“ClearClaim found N problems.”** Flags appear with fraud types and amounts.  
4. **Totals:** “Legitimate estimate ~PKR 531,000; delta ~PKR 316,000 (~37%).”  
5. **Generate dispute letter** → PDF in seconds, cited line items, structured tone.  
6. Contrast: lawyer cost and weeks vs. seconds—**emotional + economic** punch.

Without a **convincing demo bill**, the story collapses. Build the PDF first.

---

## Team split (example for a 3-hour push)

| Owner | Focus |
|--------|--------|
| You | Claude audit prompt + JSON schema; fraud-type rules in prompt |
| Person 2 | Next.js upload UI, OCR pipeline, flagged line-item table |
| Person 3 | CPT/ICD (or local code) **seed dataset** in Supabase (~500 common rows to start) |
| Person 4 | Dispute letter generator (Claude → pdf-lib) |
| Person 5 | Pitch deck + **demo bill PDF** |

**Pre-hackathon (~45 min):** One polished fake hospital bill PDF as the centerpiece.

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run start
```

---

## Documentation

| File | Purpose |
|------|---------|
| [Implementation.md](./Implementation.md) | System design, data model, APIs, audit prompt, security |
| [Implemented.md](./Implemented.md) | Honest checklist: shipped vs. planned in *this* repo |

---

## License / origin

This repo began as a Next.js marketing scaffold. Product direction, naming, and specs are evolving toward **ClearClaim** as described above. Sync deployment badges and remote URLs with your actual Vercel project when you fork or rebrand.
