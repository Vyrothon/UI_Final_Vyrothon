create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key,
  email text,
  full_name text,
  city text,
  created_at timestamptz not null default now()
);

create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  hospital_name text not null,
  patient_name text not null,
  admission_date date,
  discharge_date date,
  total_amount numeric(12,2) not null,
  currency text not null default 'PKR',
  bill_reference text,
  source_type text not null check (source_type in ('manual', 'pdf', 'image')),
  source_file_url text,
  status text not null default 'ingested' check (status in ('ingested', 'audited', 'document_generated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bill_line_items (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null,
  unit_price numeric(12,2) not null,
  total numeric(12,2) not null,
  cpt_code text,
  icd_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_reports (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null unique references public.bills(id) on delete cascade,
  total_billed numeric(12,2) not null,
  total_legitimate numeric(12,2) not null,
  overcharge_amount numeric(12,2) not null,
  overcharge_percent numeric(8,2) not null,
  verdict text not null check (verdict in ('clean', 'minor_issues', 'significant_fraud', 'severe_fraud')),
  confidence numeric(5,2) not null,
  dispute_recommended boolean not null default false,
  dispute_summary text not null,
  audit_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.generated_documents (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  audit_report_id uuid references public.audit_reports(id) on delete set null,
  document_type text not null check (document_type in ('clean_certificate', 'dispute_letter')),
  file_name text not null,
  file_content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_counters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  period_key text not null,
  scans_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, period_key)
);

create table if not exists public.rate_benchmarks (
  id uuid primary key default gen_random_uuid(),
  cpt_code text,
  description text not null,
  standard_rate_pkr_min numeric(12,2) not null,
  standard_rate_pkr_max numeric(12,2) not null,
  source text not null default 'seed',
  created_at timestamptz not null default now()
);

create table if not exists public.drug_database (
  id uuid primary key default gen_random_uuid(),
  drug_name text not null unique,
  associated_diagnoses text[] not null default '{}',
  interactions text[] not null default '{}',
  is_controlled boolean not null default false,
  drap_schedule text,
  created_at timestamptz not null default now()
);

create index if not exists idx_bills_user_id on public.bills(user_id);
create index if not exists idx_bill_line_items_bill_id on public.bill_line_items(bill_id);
create index if not exists idx_generated_documents_bill_id on public.generated_documents(bill_id);
create index if not exists idx_usage_counters_user_period on public.usage_counters(user_id, period_key);
