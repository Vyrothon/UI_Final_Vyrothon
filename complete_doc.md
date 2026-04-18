
ClearClaim
AI-Powered Medical Bill Auditor & Dispute Engine


Vyrothon 2026 — Complete Product Document
SDG 3: Good Health & Well-Being  |  SDG 10: Reduced Inequalities
Team of 5  |  3-Hour Hackathon Build

Version 1.0  |  April 2026
 
1. Executive Summary
ClearClaim is an AI-powered medical bill auditing and dispute engine. It scans hospital bills, detects fraud patterns, calculates the legitimate amount owed, and automatically generates legally structured dispute letters and escalation paths.
The core insight: hospital bills are deliberately complex. Patients pay inflated amounts not because the charges are legitimate, but because they have no reference point, no leverage, and no time to fight back. ClearClaim gives them all three.

The One-Line Pitch
Upload your hospital bill. ClearClaim finds what's wrong, tells you exactly what you legally owe, drafts the dispute letter, contacts the hospital, and escalates to lawyers and regulators if needed — automatically.

If the bill is clean — no fraud, no overcharging, no anomalous charges — ClearClaim tells you that clearly and marks it as verified. Patients get peace of mind. If it is not clean, ClearClaim becomes their fighter.

 
2. Problem Statement
2.1 The Global Reality
Medical billing fraud is one of the largest financial crimes in the world. In the United States alone, the FBI estimates 3-10% of all healthcare costs are fraudulent. In Pakistan and other developing markets, the problem is structurally worse because there is no equivalent of insurance claim auditing, no regulatory oversight of line-item billing, and virtually no consumer awareness.
2.2 How Hospitals Overcharge
Hospital billing fraud takes five main forms, all of which are invisible to an untrained patient:
•	Upcoding — billing a more complex (more expensive) procedure code than what was actually performed. Example: charging for a full surgical consultation (CPT 99245) when a nurse checked your blood pressure (CPT 99212).
•	Unbundling — splitting one procedure into multiple separately-billed components that should legally be billed as a single bundled charge.
•	Duplicate billing — billing the same service twice, often with slight date or description variations to avoid easy detection.
•	Phantom charges — billing for medications never administered, equipment never used, or bed days that did not occur.
•	Excessive markup — charging 10-40x the standard market rate for consumables like IV bags, surgical gloves, or standard medications.

2.3 Why Patients Cannot Fight Back
The system is designed to exploit patients at their most vulnerable moment. After a hospitalization, patients are exhausted, scared, and unfamiliar with medical billing codes. The bill arrives as a wall of incomprehensible line items. Three structural barriers prevent dispute:
1.	No reference point — patients have no way to know what procedures should cost
2.	No time — disputes require research, letters, follow-ups, and potentially lawyers
3.	No leverage — hospitals are large institutions; individuals feel powerless

2.4 The Pakistan-Specific Context
In Pakistan, private hospital billing operates in near-total opacity. There is no mandatory public price list, no independent auditing body, and no standard dispute resolution mechanism. Patients routinely report being charged for:
•	ICU days they did not spend in the ICU
•	Medications that were billed but never delivered to their room
•	Duplicate OT (operation theatre) charges
•	"Consumables" charges with no itemization
•	Discharge fees, facility surcharges, and "administrative" costs with no basis

The Numbers
Average private hospital bill in Pakistan: PKR 300,000 - 1,200,000
Estimated overcharge rate in Pakistani private hospitals: 20-40%
Percentage of patients who dispute their bill: under 3%
Reason for non-dispute: no knowledge, no process, no time

 
3. Solution — ClearClaim
3.1 What ClearClaim Does
ClearClaim is a web application that ingests a hospital bill (photo, PDF, or manual entry), runs it through an AI audit engine, and produces three outputs:
4.	A flagged audit report showing every suspicious or fraudulent item with plain-language explanations
5.	A fair amount calculation showing what the patient legitimately owes
6.	An action plan — either a verified clean bill confirmation, or a dispute package with letters, escalation paths, and lawyer referrals

3.2 The Intelligent Decision Tree
ClearClaim does not treat every bill as fraudulent. The audit engine runs a multi-layer analysis and follows a clear decision path:

Audit Result	Action	Who Handles It
Bill is clean — no anomalies detected	Issue verified clean bill certificate	Automated
Minor overcharges detected (under 10%)	Flag items, generate soft dispute letter to hospital billing dept	Automated
Significant fraud detected (10-40% overcharge)	Generate formal dispute letter, track response, auto follow-up	Automated + alerts
Severe fraud or no hospital response in 14 days	Escalate to insurance company if applicable	Automated
Insurance escalation fails	Generate formal complaint to PMDC / SECP / consumer court	Automated
Regulatory escalation fails or bill over PKR 500K	Refer to partner law firm with pre-packaged case file	Lawyer network

3.3 The Clean Bill Flow
This is the differentiator that builds trust. If ClearClaim determines a bill is legitimate, it does not just say nothing. It generates a Clean Bill Certificate — a stamped, dated summary that says:

Clean Bill Certificate — Sample Output
Bill Reference: AKU-2026-04872
Patient: [Name]  |  Date: April 2026  |  Hospital: Aga Khan University Hospital

ClearClaim Audit Result: VERIFIED CLEAN

All 14 line items cross-referenced against standard PKR rate benchmarks.
No upcoding, unbundling, duplicate billing, or phantom charges detected.
Charges are within normal range for the procedures performed.

Recommended action: Proceed with payment. No dispute recommended.
Confidence: 94%

 
4. Product Features — Full Specification
4.1 Bill Ingestion
•	Photo upload — user photographs physical bill with phone camera
•	PDF upload — digital bills from hospital portals
•	Manual entry — line-by-line input for partial bills
•	WhatsApp integration (Phase 2) — forward bill photo to ClearClaim number

4.2 OCR and Parsing Layer
The bill goes through an OCR pipeline that extracts structured data:
•	Hospital name and location
•	Patient name and admission/discharge dates
•	Each line item: description, quantity, unit price, total
•	Any procedure codes present (ICD-10, CPT, or Pakistani hospital codes)
•	Attending physician name
For Pakistani hospitals that use free-text descriptions rather than standardized codes, Claude performs semantic mapping — understanding that "major operation theatre charges" maps to a CPT equivalent — before running the audit.

4.3 AI Audit Engine
The audit engine runs five parallel checks on every line item:

Check	What It Does	Data Source
Rate benchmark	Compares each charge against regional standard rates	Seeded rate database + Claude knowledge
Code validation	Verifies procedure code matches description	CPT/ICD-10 code database
Duplicate detection	Finds identical or near-identical charges	Semantic similarity via pgvector
Bundling check	Detects charges that should be bundled	Medical billing rules knowledge base
Drug validation	Flags medications not typically associated with diagnosis, dangerous drug combos, or irrelevant prescriptions	Drug-diagnosis compatibility database

4.4 Drug Validation — Special Module
ClearClaim includes a dedicated drug audit module that checks every billed medication against three criteria:
•	Relevance — is this drug appropriate for the stated diagnosis? A patient admitted for appendectomy should not be billed for chemotherapy agents.
•	Safety — does the combination of billed medications create dangerous interactions? If flagged, this is escalated immediately as a patient safety issue, not just a billing issue.
•	Legitimacy — is this a controlled substance or otherwise restricted medication? Billing for controlled substances that were not documented is a criminal matter, not just a civil dispute.
If a dangerous or irrelevant drug is detected, ClearClaim generates both a billing dispute and a patient safety alert, recommending the patient consult their physician and report to DRAP (Drug Regulatory Authority of Pakistan).

4.5 Dispute Generation
For every flagged item, ClearClaim generates:
•	A plain-language explanation of why the charge is disputed
•	The legal or regulatory basis for the dispute
•	The specific amount being contested
•	The corrected amount being requested
All disputed items are compiled into a formal dispute letter with:
•	Proper legal letterhead format
•	Patient details and bill reference number
•	Itemized table of disputed charges with evidence
•	Specific demand: payment adjustment or refund
•	Response deadline (14 days as per standard practice)
•	Signature block

4.6 Escalation Engine
If the hospital does not respond within the specified timeframe, or if the response is unsatisfactory, ClearClaim automatically escalates:

Escalation Path
Level 1: Formal letter to hospital billing department (auto-generated, Day 0)
Level 2: Letter to hospital CEO / Medical Director (auto-generated, Day 14 if no response)
Level 3: Formal complaint to PMDC (Pakistan Medical & Dental Council) if medical negligence involved
Level 4: Complaint to SECP or relevant consumer protection body for financial fraud
Level 5: Referral to partner law firm with complete pre-packaged case file (for bills PKR 200K+)
Level 6: Filing assistance for consumer court or civil claim

4.7 Lawyer Network Integration
ClearClaim maintains a directory of verified medical billing lawyers in major Pakistani cities. For cases escalated to Level 5:
•	ClearClaim generates a complete case file: original bill, audit report, all correspondence, timeline
•	User is matched to 3 relevant law firms based on location and claim size
•	Firms receive the pre-packaged case file and respond with quotes
•	User selects a firm directly through the platform
•	ClearClaim takes a referral fee from the law firm (not from the patient)

 
5. Technical Architecture
5.1 Tech Stack

Layer	Technology	Purpose
Frontend	Next.js 14 (App Router)	Full-stack web app, server-side rendering, API routes
Styling	Tailwind CSS	Rapid UI development, responsive design
AI Audit Core	Claude API (claude-sonnet-4-6)	Bill analysis, fraud classification, letter generation
OCR	Google Vision API / Tesseract.js	Extract text from bill photos and PDFs
Database	Supabase (PostgreSQL)	User data, bill history, claim tracking
Vector Search	pgvector (Supabase)	Semantic duplicate detection, drug-diagnosis matching
PDF Generation	pdf-lib	Render dispute letters as downloadable PDFs
File Storage	Supabase Storage	Store uploaded bill photos and generated documents
Email/Notifications	Resend	Automated follow-up emails to hospitals
Auth	Supabase Auth	User accounts with email/phone login
Deployment	Vercel (frontend) + Supabase (backend)	Zero-config deployment, auto-scaling

5.2 Application Architecture

Component	Description
Bill Upload Service	Handles photo/PDF ingestion, runs OCR, produces structured JSON output
Rate Database	Pre-seeded table of ~800 common procedures with standard PKR rates and CPT codes
Drug Database	Table of common drugs with associated diagnoses, interactions, and control status
Audit Engine (Claude)	Core AI layer: receives structured bill JSON + rate data, returns flagged audit JSON
Decision Router	Determines escalation level based on audit severity score
Document Generator	Takes audit JSON, renders dispute letters and clean certificates as PDF
Claim Tracker	Stores correspondence history, deadlines, response status per claim
Escalation Scheduler	Cron job that checks unresolved claims past deadline and triggers next level
Lawyer Directory API	Stores verified law firms with specializations, cities, fee ranges

5.3 Database Schema

Table	Key Fields
users	id, email, phone, full_name, city, created_at
bills	id, user_id, hospital_name, admission_date, discharge_date, total_amount, bill_pdf_url, raw_ocr_json, status
bill_line_items	id, bill_id, description, quantity, unit_price, total, cpt_code, icd_code, is_flagged, flag_reason, legitimate_amount
audit_reports	id, bill_id, total_billed, total_legitimate, overcharge_amount, overcharge_percent, audit_json, clean_cert_url, created_at
disputes	id, bill_id, status (draft/sent/responded/escalated/resolved), level (1-6), letter_pdf_url, sent_at, response_due_at, resolved_at, recovered_amount
dispute_correspondence	id, dispute_id, direction (outbound/inbound), recipient, content_summary, sent_at
rate_benchmarks	id, cpt_code, description, standard_rate_pkr_min, standard_rate_pkr_max, source
drug_database	id, drug_name, generic_name, associated_diagnoses[], is_controlled, interactions[], drap_schedule
law_firms	id, name, city, specialization, contact_email, fee_type, avg_success_rate

5.4 Core Claude Prompt — Audit Engine

const auditPrompt = `
You are a senior medical billing fraud specialist with expertise in
Pakistani private hospital billing practices.

Analyze this hospital bill and perform a complete fraud audit.
Be precise. If a charge is legitimate, mark it clean.
Only flag genuine anomalies backed by the rate data provided.

Return ONLY valid JSON with this exact structure:
{
  "audit_summary": {
    "total_billed": number,
    "total_legitimate": number,
    "overcharge_amount": number,
    "overcharge_percent": number,
    "verdict": "clean | minor_issues | significant_fraud | severe_fraud",
    "confidence": number (0-100),
    "dispute_recommended": boolean
  },
  "line_items": [
    {
      "description": "string",
      "billed_amount": number,
      "legitimate_amount": number,
      "status": "clean | flagged | critical",
      "fraud_type": "none | upcoding | unbundling | duplicate | phantom | excessive_markup | drug_anomaly",
      "explanation": "string (1 sentence, plain language)",
      "dispute_strength": "strong | medium | weak | na"
    }
  ],
  "drug_audit": {
    "status": "clear | warning | critical",
    "flagged_drugs": [{ "name": "string", "reason": "string", "action": "string" }]
  },
  "dispute_summary": "string (2-3 sentences for patient to say to billing dept)"
}

Bill data: ${JSON.stringify(billData)}
Rate benchmarks: ${JSON.stringify(relevantRates)}
Drug reference: ${JSON.stringify(relevantDrugs)}
`;

5.5 Dispute Letter Generator Prompt

const letterPrompt = `
Generate a formal medical billing dispute letter.
Tone: professional, firm, non-aggressive.
Format: formal business letter.

Include:
- Patient details and bill reference
- Specific disputed items in a table
- Legal basis for each dispute
- Exact amount being contested
- Requested corrected amount
- 14-day response deadline
- Statement that non-response will trigger regulatory escalation

Patient: ${patientName}
Hospital: ${hospitalName}
Bill date: ${billDate}
Disputed items: ${JSON.stringify(flaggedItems)}
Total disputed: PKR ${disputeAmount}
`;

 
6. Hackathon Build Plan — 3 Hours
6.1 Team Split

Person	Role	Hour 1	Hour 2	Hour 3
Person 1 (Lead)	AI + Backend	Claude audit prompt, API route /api/audit	Letter generator prompt, /api/dispute	Integration, testing, edge cases
Person 2	Frontend	Next.js setup, bill upload UI, OCR call	Audit results page, flag visualization	Polish, animations, demo flow
Person 3	Data + DB	Supabase schema setup, seed rate database (500 items)	Drug database seed, pgvector setup	Connect DB to API routes
Person 4	PDF + Output	pdf-lib setup, clean cert template	Dispute letter PDF template	Test PDF generation end-to-end
Person 5	Pitch + Demo	Build pitch deck (7 slides)	Create demo bill PDF	Practice pitch, prep demo script

6.2 Pre-Hackathon Prep (Night Before — 1 Hour)
This is what separates a winning demo from a half-finished prototype. Do this before the clock starts:
7.	Create the demo bill: A realistic fake hospital bill for a 3-day admission. Include: room charges, OT charges, medication list, consumables. Deliberately include: one upcoded OT charge, one phantom medication, one duplicate room charge, one excessive markup on an IV bag. Total: PKR 847,000.
8.	Seed the rate database: 500 common procedure codes with PKR rates. Export as a JSON file ready to bulk-insert into Supabase.
9.	Seed the drug database: 200 common hospital drugs with associated diagnoses. Include a few clearly wrong pairings for demo purposes.
10.	Test the Claude audit prompt locally with the demo bill — confirm the JSON output is clean and the right items get flagged.
11.	Set up Supabase project and verify connection strings.

6.3 What to Demo (3 Minutes Exactly)

3-Minute Demo Script
0:00 — Open ClearClaim. Show clean, minimal dashboard. Say: 'This is a bill from a Lahore private hospital. PKR 847,000.'
0:20 — Upload the demo PDF. Watch OCR parse it live — line items appear on screen.
0:50 — Audit runs. Show the loading state. Results appear: '6 issues found. PKR 312,000 in potential overcharges — 37% of your bill.'
1:20 — Walk through 2-3 flagged items. 'This OT charge — billed as PKR 185,000. Standard rate: PKR 95,000. Upcoding detected.' Click for explanation.
1:50 — Show the drug audit: 'One medication flagged — not associated with your diagnosis. Recommended action: verify with your doctor.'
2:10 — Click Generate Dispute Package. PDF downloads in 3 seconds. Show first page of the letter.
2:30 — Show escalation path: 'If hospital doesn't respond in 14 days, we escalate to the regulator automatically. If that fails, here are 3 matched law firms.'
2:50 — Show a clean bill result: upload a second bill with no issues. Green certificate: VERIFIED CLEAN. No action needed.
3:00 — End on: 'PKR 312,000 recovered. One upload. Three minutes.'

 
7. Business Model
7.1 Revenue Streams

Stream	Model	Price	Target
B2C Freemium	Free audit + clean cert. Paid dispute package.	Free / PKR 999 per dispute	Individual patients
B2C Success Fee	Manage full dispute. Take % of recovery.	10% of recovered amount (min PKR 5,000)	Large bills PKR 500K+
B2B — Insurers	API integration. Per-claim audit before approval.	PKR 150-400 per audit	Jubilee, EFU, State Life
B2B — Corporates	Audit all employee medical reimbursements.	PKR 15,000-50,000/month subscription	Companies with health benefits
Lawyer Referrals	Referral fee from law firm per case.	10-15% of law firm first invoice	Partner law firms

7.2 Why the Business Model is Defensible
•	B2C value proposition is obvious: PKR 999 to potentially recover PKR 100,000+. Conversion rate will be high.
•	B2B insurer play is the biggest opportunity. Insurance companies are being defrauded by the same hospitals. They have budget, they understand ROI, and they need this now.
•	The data moat: every audited bill trains the model better. Over time, ClearClaim knows the overcharging patterns of every major hospital. That knowledge is irreplaceable.
•	Law firm referrals are passive income that scale with the number of escalated cases.

7.3 Growth Roadmap

Phase	Timeline	Key Milestone
Phase 1 — MVP	Month 0-3	Launch B2C web app. 500 bills audited. First 50 paying users.
Phase 2 — Retention	Month 3-6	WhatsApp bot integration. Family plan (multiple users). 5,000 bills audited.
Phase 3 — B2B	Month 6-12	First insurer API contract. First corporate subscription. Break-even.
Phase 4 — Expand	Month 12-24	Launch in India and Bangladesh (same problem, 10x market). Series A target.
Phase 5 — Data	Month 24+	Sell anonymized hospital pricing intelligence to regulators and policy bodies.

 
8. SDG Alignment
SDG 3 — Good Health and Well-Being
ClearClaim directly addresses SDG 3.8: Achieve universal health coverage and access to quality essential healthcare services. Overcharging does not just cause financial harm — it causes patients to avoid seeking medical care because they fear they cannot afford the bill. By making hospital billing transparent and giving patients a tool to fight back, ClearClaim removes a structural barrier to healthcare access.
The drug audit module adds a direct patient safety dimension: identifying dangerous drug combinations or medically inappropriate prescriptions on billing records is a clinical safety intervention, not just a financial one.

SDG 10 — Reduced Inequalities
Hospital billing fraud is a regressive tax. Rich families can afford lawyers. Everyone else pays what the hospital demands. ClearClaim directly addresses SDG 10.2: Empower and promote the social, economic and political inclusion of all, irrespective of economic status. A family paying for their father's cardiac surgery in a private hospital should have the same ability to dispute fraudulent charges as a corporation disputing a vendor invoice. ClearClaim closes that gap.

 
9. Vyrothon Evaluation Checklist

Criteria	How ClearClaim Addresses It
AI-based solution	Claude API is the core audit engine — not a wrapper, but a structured fraud analysis system with domain-specific prompting, rate benchmarking, and drug interaction checking.
Solving real-world problem	Medical billing fraud affects every family that uses a private hospital. Every judge in the room has a personal story. The problem is universal, the pain is visceral, and the solution is immediately understandable.
Scalability / growth roadmap	B2C to B2B insurer API to data intelligence layer. Clear expansion to India and Bangladesh. Each phase is independently viable and funds the next.
Creative and scalable solution	No existing product in Pakistan does this. The combination of bill OCR + AI fraud classification + auto-generated legal dispute letters + escalation engine + lawyer network is genuinely novel in this market.
Best UX & design practices	Clean upload interface, visual flag indicators on each line item, clear savings number at the top, one-click document generation, status tracking dashboard. No complexity exposed to the user.

 
10. Pitch Deck Outline — 3 Minutes
Slide 1 — Hook (20 seconds)
Visual: A PKR 847,000 hospital bill on screen. One line of text: 'Your family paid this. PKR 312,000 of it was fraud.'

Slide 2 — Problem (30 seconds)
Hospital bills are deliberately incomprehensible. 20-40% overcharging is standard practice. Patients have no reference point, no leverage, and no time to fight. 97% of patients never dispute.

Slide 3 — Solution (20 seconds)
ClearClaim: Upload your bill. We find what's wrong. We fight for you.

Slide 4 — Live Demo (3 minutes)
Follow the demo script from Section 6.3.

Slide 5 — Tech Stack (20 seconds)
Next.js, Claude API, Supabase, Google Vision, pdf-lib. Built in 3 hours. Deployed and live.

Slide 6 — Business Model (30 seconds)
PKR 999 per dispute. 10% success fee on large recoveries. B2B insurer API at PKR 200 per audit. One insurer contract = millions of audits per year.

Slide 7 — Impact (20 seconds)
SDG 3 and SDG 10. Every Pakistani family with a hospital bill is a customer. This is the tool that equalizes the fight between patients and hospitals.

 
11. Risks and Mitigations

Risk	Mitigation
AI hallucination — Claude flags a legitimate charge as fraud	All flags include confidence score. Low-confidence flags are shown as 'worth reviewing' not 'definitely fraud'. User always reviews before sending dispute.
Hospitals ignore letters	Escalation engine handles this automatically. Each level is stronger. Lawyer referral is the final lever.
Pakistan lacks standardized billing codes	Claude's semantic understanding maps free-text descriptions to equivalent codes. Rate benchmarks are built on actual hospital bills, not just code tables.
Regulatory pushback from hospital industry	ClearClaim does not accuse hospitals. It identifies anomalies. The dispute letter says 'please clarify' not 'you committed fraud'. Framing matters.
User trust — will patients share sensitive bills?	Bills are stored encrypted. Option to delete after audit. Privacy policy is prominent. No data sold. Anonymized aggregate data only for B2B use.

 
12. Team Roles and Responsibilities

Role	Hackathon Task	Post-Hackathon
Lead Developer	Claude API integration, audit engine, API architecture	Full-stack product development, AI prompt refinement
Frontend Developer	Next.js UI, bill upload, results visualization	Mobile-first redesign, WhatsApp integration
Backend / Data	Supabase schema, rate database, drug database	Data pipeline, rate database expansion, analytics
Document Engineering	PDF generation, dispute letter templates	Legal template library, multi-language support
Strategy / Pitch	Pitch deck, demo prep, competitor research	Business development, insurer partnerships, go-to-market

 
ClearClaim
The fight between patients and hospitals has always been unfair.
ClearClaim makes it fair.

Vyrothon 2026  |  SDG 3 + SDG 10  |  clearclaim.pk
