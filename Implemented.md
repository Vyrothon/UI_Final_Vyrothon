# ClearClaim — What is implemented in this repository

This file is an **honest inventory**: what exists in the codebase **today** versus what [Implementation.md](./Implementation.md) describes. Update it whenever you ship a meaningful slice.

**Last reviewed:** 2026-04-18 (manual).

---

## Implemented (in this repo)

### Application shell

- **Next.js** App Router project (`app/`, `npm run dev` / `build` / `start`).
- **Marketing / landing UX**: hero, sections, FAQ, testimonials, integrations copy, feature cards—**positioned** around medical billing clarity, OCR, dispute prep, and Pakistan/global opacity themes (earlier iteration used “Vyro” naming in some metadata).
- **Shared UI**: Tailwind, Radix-based components, layout, navbar, footer, floating schedule CTA, newsletter form (`/api/newsletter` if configured).

### Content and positioning

- README + this file + **Implementation.md** describe **ClearClaim** product intent, SDG framing, business model, and demo script.
- Structured data / SEO metadata updated toward medical bill auditing narrative (verify URLs and brand strings match production).

### Documentation

- **[README.md](./README.md)** — product story, demo, team split, disclaimers.
- **[Implementation.md](./Implementation.md)** — technical blueprint (schemas, prompts, Supabase sketch, APIs).

---

## Not implemented yet (gaps vs. blueprint)

These are **not** present as working features in this repo unless you add them:

| Area | Status |
|------|--------|
| **Claude (or other LLM) audit API** | Not wired; no `ANTHROPIC_API_KEY` flow in app. |
| **Structured audit JSON + Zod validation** | Spec only in Implementation.md. |
| **OCR** (Tesseract.js / Google Vision) | No upload pipeline or `/api/ocr`. |
| **Bill parser** (`BillDocument`) | No canonical parser or types in `lib/`. |
| **Supabase** (Postgres, auth, Storage, pgvector) | No client; no migrations. |
| **`rate_reference` seed data** | Not in repo. |
| **Dispute letter PDF** (`pdf-lib`) | Not implemented. |
| **Resend / Nodemailer** to hospitals | Not implemented; newsletter may be separate. |
| **Authenticated user bill history** | No Supabase auth integration. |
| **End-to-end demo flow** | No single “upload → audit → PDF” path in UI. |

---

## Suggested next commits (priority order)

1. **`lib/types/bill.ts`** — TypeScript types for `BillDocument` / `AuditResult`.  
2. **`app/api/audit/route.ts`** — Mock JSON first; then Claude + Zod.  
3. **Demo page** — Upload or paste JSON; render flagged table + savings header.  
4. **Supabase project** — Apply schema from Implementation.md; seed CSV for rates.  
5. **OCR route** — File in → text out; then parser.  
6. **`/api/dispute-letter` + PDF** — Download button.

After each item, update the **Implemented** section above and tick the row in the gaps table.

---

## Naming and branding

The codebase may still contain **legacy assets** (e.g. logos, old paths, v0 sync notes). Treat **ClearClaim** as the product name in docs; align `package.json` name, metadata, and assets when you finalize brand and domain.

---

## Disclaimer (repeat)

In-product and in docs: ClearClaim assists with **analysis and preparation** for disputes. It does not provide legal or medical advice. Outcomes depend on providers, insurers, and local law.
