# ClearClaim AI — Implementation plan

This document maps the **[README.md](./README.md) business plan** to **systems**: APIs, data, payments, marketplace, compliance jobs, and build order. It is a specification—not a guarantee that code exists yet. See **[Implemented.md](./Implemented.md)** for repo status.

**Legal note.** Attorney referral fees, fee-splitting, and “paralegal” scope differ by **country and bar rules**. Everything below is a **product intent** to validate with counsel before launch.

---

## 1. End-to-end flow (engineering)

```
Sign-up (country, Stripe customer)
  → entitlements: free | pro | family (6 seats)

Upload bill (+ optional discharge summary)
  → Storage (raw files)
  → POST /api/ingest-vision  (Claude Vision or Vision API + structured extract)
  → BillDocument + ClinicalContext JSON in DB

Audit
  → resolve country → rate_reference dataset (or pattern-only mode)
  → POST /api/audit  (Claude text + rates JSON → AuditResult, Zod-validated)
  → persist audit_results; enforce free-tier “no letter” flag in API

Dashboard
  → GET report; red-line UI from flagged_items

User action
  A) POST /api/dispute-letter  (gated: pro+; pdf-lib PDF)
  B) POST /api/paralegal-case  (digital agreement record; internal queue)
  C) GET /api/marketplace/match  (ranked firms); POST /api/marketplace/connect
        → referral row + email audit pack to firm + SLA timer

Tracking
  → dispute_outcomes (self-report MVP); Stripe invoice for success fee
  → cron: 45-day outcome prompt

Aggregation (batch)
  → nightly: hospital_id clusters; if count ≥ 10 in 30d → flag + notify PM for “group action” workflow
```

Use **Next.js Route Handlers** under `app/api/...`.

---

## 2. Country configuration (Rule 10)

Centralize in `country_config` (DB or typed JSON) keyed by ISO country code:

| Key | Purpose |
|-----|---------|
| `payments_provider` | `stripe` \| `razorpay` \| … |
| `currency_default` | e.g. USD, INR, AED |
| `rate_dataset_id` | FK to which `rate_reference` partition is active; `null` → pattern-only + UI disclaimer |
| `letter_template_id` | Jurisdiction-specific dispute letter scaffold |
| `legal_partner_pool_id` | Marketplace firm filter |
| `compliance_mode` | `hipaa_us` \| `gdpr_uk` \| `meaed_uae` \| `india_consumer` \| `generic` |
| `medication_reference` | e.g. `fda_label` (US); `null` → hide or alternate data source |

**Implementation:** `GET /api/config/country?code=` for client; server enforces on every audit/letter call.

---

## 3. Entitlements & tiers (Rules 1–2)

| Tier | Scans / month | Report | Letter | Marketplace | Med check |
|------|----------------|--------|--------|-------------|-----------|
| Free | 1 | Basic | No | No | No |
| Pro | Unlimited | Full | Yes | Yes | Yes |
| Family | Unlimited (6 members) | Full | Yes | Yes | Yes |

Store on `subscriptions` (Stripe subscription id, tier, seat count). **Enforce in API**, not only UI.

---

## 4. Core document schemas

### 4.1 Bill document (bill + clinical context)

Extend prior `BillDocument` with discharge summary linkage:

```typescript
type BillDocument = {
  currency: string
  country_code: string
  provider_name: string | null
  patient_name: string | null
  admission_date: string | null
  discharge_date: string | null
  lines: BillLine[]
  subtotals: { label: string; amount: number }[]
  total_billed: number
  raw_text?: string
  /** Parsed from discharge summary when uploaded */
  clinical_summary?: {
    diagnoses_mentioned: string[]
    procedures_mentioned: string[]
    medications_mentioned: string[]
    length_of_stay_hint: number | null
  }
}
```

### 4.2 Audit result (unchanged shape; see below)

Keep `AuditResult` / `FlaggedItem` / `FraudType` as in earlier spec; add optional `rate_source: "government_schedule" | "pattern_only"`.

### 4.3 Medication appropriateness (Rule 8)

Separate artifact, **never** merged into legal advice:

```typescript
type MedicationFlag = {
  drug_name: string
  diagnosis_context: string
  flag_reason: string
  disclaimer: "informational_not_medical_advice"
}
```

UI: every row shows the mandatory disclaimer; ToS reference.

---

## 5. Claude: Vision ingest vs audit

**Ingest (bill + discharge):** Multimodal message with PDF/images; system instruction to return **JSON only** matching `BillDocument` + `clinical_summary` subset. Redact PHI in logs.

**Audit:** Text-only (cheaper, testable) using `BillDocument` + `relevantRates[]` from DB.

Prompt bodies for audit remain as in **§6** (below); add instruction: if `rate_dataset_id` is null, set `limitations` explicitly and never invent government rates.

---

## 6. Claude audit prompt (production template)

**System (concept):**

```text
You are a medical billing fraud analyst assistant for educational and dispute-prep purposes.
You are not a lawyer or clinician. Never claim certainty when codes or records are missing.
Output ONLY valid JSON matching the schema the user provides. No markdown fences.
Flag only items with explicit bill evidence; use "weak" dispute_strength when inferring.
If standard rates are missing, set legitimate_amount to null and explain in explanation.
Detect: upcoding, unbundling, duplicate, phantom, excessive_markup.
Phantom = charge not plausibly supported by bill or discharge context.
If rate_dataset was unavailable, set rate_source mentally to pattern_only and state limitations clearly.
```

**User message template:**

```text
Analyze this hospital bill and return JSON with this exact shape:
{
  "total_billed": number,
  "total_legitimate": number,
  "overcharge_amount": number,
  "overcharge_percent": number,
  "rate_source": "government_schedule | pattern_only",
  "flagged_items": [
    {
      "line_item": "string",
      "line_id": "string optional",
      "billed_amount": number,
      "legitimate_amount": number | null,
      "fraud_type": "upcoding | unbundling | duplicate | phantom | excessive_markup | other",
      "explanation": "string (plain language, 1 sentence)",
      "dispute_strength": "strong | medium | weak",
      "cpt_code": "string or null",
      "icd_code": "string | null"
    }
  ],
  "dispute_summary": "string (2-3 sentences a patient can say to billing)",
  "patient_talking_points": ["string", "string"],
  "limitations": "string (what you could not verify)"
}

Bill data:
{{BILL_JSON}}

Standard rates reference (may be partial; do not invent rates not listed):
{{RATES_JSON}}

Rules:
- If two lines likely duplicate the same service, mark duplicate and cite both descriptions.
- If a bundle of lines should be one global fee, mark unbundling.
- If a line appears inflated vs reference, mark excessive_markup.
- Compute overcharge_percent from totals; if legitimate unknown, estimate conservatively and note in limitations.
```

Wire `{{BILL_JSON}}` and `{{RATES_JSON}}` in code. **Temperature** ~0.2. Validate with **Zod**; one retry: “JSON only, no markdown.”

---

## 7. Supabase schema additions (beyond bills + audits)

```sql
-- Datasets first (country_config references rate_dataset)
create table rate_dataset (
  id uuid primary key default gen_random_uuid(),
  label text,
  country_code text not null -- ISO code; FK to country_config added after both exist if desired
);

create table country_config (
  country_code text primary key,
  payments_provider text not null,
  currency_default text not null,
  rate_dataset_id uuid references rate_dataset(id),
  letter_template_id uuid,
  legal_partner_pool_id uuid,
  compliance_mode text not null,
  medication_reference text
);

-- alter rate_reference: add rate_dataset_id uuid references rate_dataset(id)

-- Stripe / tiers
create table user_profiles (
  id uuid primary key references auth.users(id),
  country_code text references country_config(country_code),
  stripe_customer_id text,
  created_at timestamptz default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  stripe_subscription_id text unique,
  tier text check (tier in ('free','pro','family')),
  family_seat_limit int default 1,
  current_period_end timestamptz
);

create table usage_counters (
  user_id uuid references auth.users(id),
  month date, -- first day of month
  scans int default 0,
  primary key (user_id, month)
);

-- Marketplace (Rule 4, 5, 6)
create table law_firms (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid,
  name text,
  jurisdictions text[],
  case_types text[],
  win_rate numeric,
  avg_recovery numeric,
  avg_response_hours numeric,
  user_rating numeric,
  commission_rate_offered numeric, -- for 5% ranking factor
  accepts_referral_terms boolean default false, -- $400 + 6%
  delisted_at timestamptz,
  consecutive_missed_sla int default 0
);

create table referrals (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references law_firms(id),
  user_id uuid references auth.users(id),
  audit_id uuid references audit_results(id),
  status text, -- pending | accepted | closed
  referred_at timestamptz default now(),
  firm_first_response_at timestamptz,
  flat_fee_invoice_id text, -- $400
  contingency_pct numeric default 0.06
);

-- Paralegal / Option B (Rule 3)
create table paralegal_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  audit_id uuid references audit_results(id),
  agreement_signed_at timestamptz,
  minimum_fee_cents int default 14900,
  success_fee_bps int default 1500, -- 15%
  status text
);

-- Outcomes & Stripe (Rule 12)
create table dispute_outcomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  audit_id uuid references audit_results(id),
  source text check (source in ('self_report','ams_integration')),
  recovered_amount numeric,
  reported_at timestamptz,
  stripe_charge_id text
);

-- Hospital aggregation (Rule 11)
create table bill_runs (
  -- ... existing columns ...
  hospital_fingerprint text -- normalized provider name + city + country
);

create table hospital_alerts (
  hospital_fingerprint text primary key,
  window_start date,
  window_end date,
  complaint_count int,
  group_action_eligible boolean default false
);
```

**Ranking query (Rule 5):** compute score in SQL or app layer from firm columns; weight as spec; exclude `delisted_at is not null`.

**SLA job (Rule 6):** hourly cron: for referrals where `now - referred_at > 24h` and no `firm_first_response_at`, increment `consecutive_missed_sla`; at 3 → set `delisted_at`.

---

## 8. Retention job (Rule 7)

- Daily cron: delete Storage objects and scrub `ocr_text` / `parsed_json` for `bill_runs` older than **90 days** unless `user_consent_long_storage = true` on profile.
- `user_delete` endpoint: immediate purge.
- Log deletions for audit.

---

## 9. Payments (Stripe)

- Products: Pro, Family.  
- Webhooks: `customer.subscription.updated` → sync `subscriptions`.  
- Success fee: **PaymentIntent** or **Invoice** when `dispute_outcomes.recovered_amount` set; amount = `max(recovered * 0.15, 14900 cents)` per business rules—**confirm legality**.  
- Attorney flat **$400**: Stripe Connect or invoicing partner—**accounting + ethics**.

---

## 10. OCR / Vision

| Path | Use |
|------|-----|
| Claude Vision (multimodal) | Primary for hackathon if API allows PDFs/images |
| Google Document AI / Vision | Fallback for table extraction |
| Tesseract | Offline / cost control |

**API:** `POST /api/ingest-vision` → `{ billDocument, clinical_summary }`.

---

## 11. Dispute letter PDF (Option A)

- Template per `letter_template_id` (merge fields from `AuditResult` + patient/hospital addresses).  
- Footer (Rule 9): AI-generated; user must review; not legal advice.  
- `pdf-lib` render; store to Storage; signed URL.

---

## 12. Email

- **Resend** (or Nodemailer): marketplace intake package to firm; 45-day outcome nudges; never hospital without user confirm.  
- Track sends for SLA.

---

## 13. Environment variables (additions)

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RAZORPAY_KEY_ID=        # India phase
RAZORPAY_KEY_SECRET=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

---

## 14. Suggested build order (updated)

1. **Auth + profiles** + `country_config` seed (US first).  
2. **Mock Vision → BillDocument** + audit API + dashboard UI.  
3. **Stripe** subscriptions + usage counter (free 1/month).  
4. **Dispute letter** PDF + pro gate.  
5. **Supabase** full schema + rate dataset US + pgvector.  
6. **Marketplace** read path + referral row + firm SLA cron.  
7. **Paralegal** case type + agreement capture (DocuSign / native).  
8. **Outcome self-report** + Stripe success charge.  
9. **Hospital aggregation** batch job + admin flag.  
10. **Medication check** (US FDA source) + disclaimers.  
11. **India** Razorpay + templates; **UK/UAE** compliance modes.

---

## 15. Optional appendices to add later

- Slide-by-slide pitch deck (not in repo unless you add).  
- Bar ethics memo per state / country.  
- Rate bibliography (CMS, state FAIR health, etc.) with refresh jobs.
