create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_code text not null check (plan_code in ('free', 'pro', 'family')),
  status text not null check (status in ('active', 'trialing', 'past_due', 'canceled')),
  provider text not null default 'manual',
  provider_customer_id text,
  provider_subscription_id text,
  started_at timestamptz not null default now(),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  audit_report_id uuid not null references public.audit_reports(id) on delete cascade,
  status text not null check (status in ('draft', 'sent', 'responded', 'escalated', 'resolved')),
  level integer not null default 1 check (level between 1 and 6),
  letter_document_id uuid references public.generated_documents(id) on delete set null,
  response_due_at timestamptz,
  sent_at timestamptz,
  resolved_at timestamptz,
  recovered_amount numeric(12,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bill_id)
);

create table if not exists public.dispute_correspondence (
  id uuid primary key default gen_random_uuid(),
  dispute_id uuid not null references public.disputes(id) on delete cascade,
  direction text not null check (direction in ('outbound', 'inbound')),
  recipient text not null,
  channel text not null default 'email',
  content_summary text not null,
  sent_at timestamptz not null default now()
);

create table if not exists public.law_firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  specialization text not null default 'medical_billing',
  contact_email text not null,
  response_sla_hours integer not null default 24,
  is_active boolean not null default true,
  missed_sla_count integer not null default 0,
  score numeric(6,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  dispute_id uuid not null references public.disputes(id) on delete cascade,
  law_firm_id uuid not null references public.law_firms(id) on delete cascade,
  status text not null check (status in ('sent', 'accepted', 'declined', 'expired')),
  response_due_at timestamptz not null,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.paralegal_cases (
  id uuid primary key default gen_random_uuid(),
  dispute_id uuid not null references public.disputes(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  agreement_signed boolean not null default false,
  status text not null check (status in ('open', 'in_review', 'closed')) default 'open',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dispute_outcomes (
  id uuid primary key default gen_random_uuid(),
  dispute_id uuid not null references public.disputes(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  recovered_amount numeric(12,2) not null default 0,
  source text not null default 'self_reported',
  success_fee_amount numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.hospital_alerts (
  id uuid primary key default gen_random_uuid(),
  hospital_name text not null,
  disputes_in_30_days integer not null default 0,
  triggered_at timestamptz not null default now(),
  status text not null default 'open'
);

create index if not exists idx_disputes_bill_id on public.disputes(bill_id);
create index if not exists idx_referrals_dispute_id on public.referrals(dispute_id);
create index if not exists idx_referrals_law_firm_id on public.referrals(law_firm_id);
