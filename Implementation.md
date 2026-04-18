# ClearClaim — Implementation blueprint

This document turns the product thesis into **buildable** systems: data flow, storage, APIs, prompts, and operational guardrails. It is a specification—not a guarantee that every piece is coded yet. See [Implemented.md](./Implemented.md) for current repo status.

---

## 1. Core insight (engineering translation)

Patients lack **structured leverage**. The product must output:

1. **Structured bill JSON** (OCR + normalization)  
2. **Audit JSON** (flags, fraud types, strength, amounts)  
3. **Dispute artifacts** (letter text, PDF, optional email)  
4. **Persistence** (history, statuses, embeddings for code lookup)

“Negotiates” in v1 means: **drafts, tracks templates, and tells the user what to say**—not autonomous legal representation. Wording in the product must avoid implying licensed advocacy unless you are.

---

## 2. High-level architecture

```
[Client] upload (image/PDF)
    → API: /api/ocr  →  raw text + layout hints
    → API: /api/parse-bill  →  structured Bill JSON (line items, codes, totals)
    → DB: insert bill_run, line_items

[Client] “Run audit”
    → API: /api/audit
        → fetch reference_rates (SQL + optional vector search on code/description)
        → Claude: auditPrompt(billJson, relevantRates)
        → validate JSON schema; store audit_result

[Client] “Generate letter”
    → API: /api/dispute-letter
        → Claude: letterPrompt(auditJson, tone, locale PK/en)
        → pdf-lib: render PDF
        → optional Resend: email to user / draft to hospital (user confirms)

[Future] webhooks, claim status, reminders
```

Use **Next.js Route Handlers** (`app/api/.../route.ts`) for each step so the UI stays thin.

---

## 3. Bill JSON schema (canonical)

OCR and parsing should converge on something stable the audit model consumes:

```typescript
// Conceptual — adjust field names to your parser
type BillLine = {
  id: string
  description: string
  /** Local or CPT-like procedure code if present */
  procedure_code: string | null
  /** ICD-10 if present on line or admission summary */
  diagnosis_codes: string[]
  quantity: number | null
  unit_price: number | null
  line_total: number
  /** service date if parsed */
  service_date: string | null
  category_guess: "room" | "pharmacy" | "surgery" | "lab" | "consumable" | "other" | null
}

type BillDocument = {
  currency: "PKR" | "USD" | string
  provider_name: string | null
  patient_name: string | null
  admission_date: string | null
  discharge_date: string | null
  lines: BillLine[]
  subtotals: { label: string; amount: number }[]
  total_billed: number
  /** raw OCR text blob for debugging */
  raw_text?: string
}
```

**Pakistan note:** Many private bills may not expose ICD/CPT cleanly. The parser should still populate `description`, amounts, and dates; codes may be `null` and the audit prompt must handle **pattern-only** detection (duplicates, phantom *candidates*, unbundle heuristics).

---

## 4. Audit result JSON (Claude output)

Single call drives UI, savings banner, and letter seed:

```typescript
type FraudType =
  | "upcoding"
  | "unbundling"
  | "duplicate"
  | "phantom"
  | "excessive_markup"
  | "other"

type FlaggedItem = {
  line_item: string
  line_id?: string
  billed_amount: number
  legitimate_amount: number | null
  fraud_type: FraudType
  explanation: string
  dispute_strength: "strong" | "medium" | "weak"
  cpt_code: string | null
  icd_code: string | null
}

type AuditResult = {
  total_billed: number
  total_legitimate: number
  overcharge_amount: number
  overcharge_percent: number
  flagged_items: FlaggedItem[]
  dispute_summary: string
  /** optional narrative for UI */
  patient_talking_points?: string[]
  limitations?: string
}
```

**Validation:** Parse Claude output with **Zod**; on failure, retry once with “JSON only, no markdown.”

---

## 5. Claude audit prompt (full)

Use a system message for role + rules; user message contains data only.

**System (concept):**

```text
You are a medical billing fraud analyst assistant for educational and dispute-prep purposes.
You are not a lawyer or clinician. Never claim certainty when codes or records are missing.
Output ONLY valid JSON matching the schema the user provides. No markdown fences.
Flag only items with explicit bill evidence; use "weak" dispute_strength when inferring.
If standard rates are missing, set legitimate_amount to null and explain in explanation.
Detect: upcoding, unbundling, duplicate, phantom, excessive_markup.
Phantom = charge not plausibly supported by bill context (e.g. OR drugs on a discharge-only line list with zero surgery line).
```

**User message template:**

```text
Analyze this hospital bill and return JSON with this exact shape:
{
  "total_billed": number,
  "total_legitimate": number,
  "overcharge_amount": number,
  "overcharge_percent": number,
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
      "icd_code": "string or null"
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

Wire `{{BILL_JSON}}` and `{{RATES_JSON}}` in application code. Keep **temperature low** (e.g. 0.2) for audit consistency.

---

## 6. Retrieving “relevant rates” before the audit

Without this, the model guesses.

1. **Extract** all non-null procedure/diagnostic codes from `BillDocument`.  
2. **Query** `rate_reference` by exact code match.  
3. **Fallback:** `pgvector` similarity search on embedding of `(code + description)` top-k ≤ 20.  
4. Pass only those rows into `RATES_JSON` to bound context size.

**Embedding model:** Whichever you standardize on (e.g. OpenAI `text-embedding-3-small` or local)—store `embedding vector(1536)` in Supabase.

---

## 7. Supabase schema (sketch)

```sql
-- Bills uploaded or parsed
create table bill_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  created_at timestamptz default now(),
  currency text,
  provider_name text,
  raw_storage_path text, -- Supabase Storage
  parsed_json jsonb,
  ocr_text text
);

create table bill_lines (
  id uuid primary key default gen_random_uuid(),
  bill_run_id uuid references bill_runs(id) on delete cascade,
  sort_index int,
  description text,
  procedure_code text,
  line_total numeric,
  payload jsonb
);

-- Reference data (seed ~500+ rows to start)
create table rate_reference (
  id uuid primary key default gen_random_uuid(),
  code text,
  code_system text, -- 'CPT' | 'LOCAL' | 'UNKNOWN'
  description text,
  standard_amount numeric,
  currency text default 'PKR',
  region text, -- 'PK-SINDH' | 'GLOBAL' etc.
  effective_from date,
  effective_to date,
  source text,
  embedding vector(1536)
);

create index on rate_reference using ivfflat (embedding vector_cosine_ops);

create table audit_results (
  id uuid primary key default gen_random_uuid(),
  bill_run_id uuid references bill_runs(id) on delete cascade,
  model text,
  result_json jsonb,
  created_at timestamptz default now()
);

create table dispute_artifacts (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references audit_results(id) on delete cascade,
  letter_markdown text,
  pdf_storage_path text,
  created_at timestamptz default now()
);
```

RLS: users read/write only their `bill_runs`. Service role for batch seeding `rate_reference`.

---

## 8. OCR pipeline

| Stage | Option | Notes |
|-------|--------|--------|
| Rasterize PDF | `pdfjs-dist` or server tool | One image per page or text extract |
| OCR | Tesseract.js (client or worker) or Vision API | Vision wins on skewed photos |
| Layout | Vision bounding boxes if available | Helps table reconstruction |
| Parse | Claude or rules-based table parser | Claude costs $; rules are brittle |

**API shape:** `POST /api/ocr` → `{ text, pages: [{ page, text }] }`  
Then `POST /api/parse-bill` → `BillDocument`

---

## 9. Dispute letter generation

1. Input: `AuditResult` + patient/hospital addresses + locale.  
2. Claude prompt: formal letter, cite **specific lines and amounts**, avoid defamation, include “request itemized justification / medical records” where appropriate.  
3. **pdf-lib:** header, body, signature block; embed PKR amounts and dates.  
4. Store PDF in Storage; return signed URL.

**Regulatory:** Letter tone must be jurisdiction-aware; default to neutral “request for review and correction.”

---

## 10. Email automation

- **Resend** (preferred) or Nodemailer + SMTP.  
- Never email the hospital without **explicit user confirmation** of recipient and body.  
- Log sends in `dispute_artifacts` or `outbound_messages`.

---

## 11. Security and privacy

- Health and financial data: **encrypt at rest** (Supabase), TLS in transit, minimal retention policy.  
- Do not train public models on user bills without consent.  
- Add **data deletion** endpoint for user-driven erasure.  
- Show in-product **disclaimer** on every audit view.

---

## 12. Environment variables (example)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
OCR_GOOGLE_APPLICATION_CREDENTIALS= # if Vision
RESEND_API_KEY=
```

---

## 13. Suggested build order

1. Demo bill PDF + static JSON mock of `BillDocument` (no OCR yet).  
2. Audit route + prompt + Zod validation + UI table.  
3. OCR + parse → replace mock.  
4. Supabase + rate seed + vector retrieval.  
5. Letter PDF + download.  
6. Email confirm flow.  
7. Auth + persistence + history.

---

## 14. Optional next documents

- Jurisdiction appendix (Pakistan consumer forums, insurance complaint routes)—**legal review required**.  
- Rate source bibliography (official fee schedules, insurer agreements)—per data partner.
