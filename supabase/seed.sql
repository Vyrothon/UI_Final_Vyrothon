insert into public.rate_benchmarks (cpt_code, description, standard_rate_pkr_min, standard_rate_pkr_max, source)
values
  ('99212', 'General follow-up consultation', 1500, 5000, 'clearclaim_seed'),
  ('99245', 'Comprehensive surgical consultation', 12000, 25000, 'clearclaim_seed'),
  ('44950', 'Appendectomy procedure package', 90000, 160000, 'clearclaim_seed'),
  ('01967', 'Operation theatre anesthesia charge', 25000, 60000, 'clearclaim_seed'),
  ('ROOM-GEN', 'General ward room day', 8000, 18000, 'clearclaim_seed'),
  ('ROOM-ICU', 'ICU room day', 35000, 85000, 'clearclaim_seed'),
  ('IVBAG-01', 'IV fluid consumable bag', 250, 1200, 'clearclaim_seed'),
  ('LAB-CBC', 'Complete blood count panel', 1000, 3500, 'clearclaim_seed')
on conflict do nothing;

insert into public.drug_database (drug_name, associated_diagnoses, interactions, is_controlled, drap_schedule)
values
  ('Ceftriaxone', array['infection', 'post-operative care'], array['warfarin'], false, null),
  ('Paracetamol', array['pain', 'fever', 'post-operative care'], array[]::text[], false, null),
  ('Morphine', array['severe pain', 'post-operative care'], array['benzodiazepines'], true, 'Schedule G'),
  ('Ondansetron', array['nausea', 'post-operative care'], array[]::text[], false, null),
  ('Cyclophosphamide', array['cancer'], array[]::text[], true, 'Schedule G')
on conflict (drug_name) do nothing;

insert into public.law_firms (name, city, specialization, contact_email, score)
values
  ('Khan & Partners', 'Lahore', 'medical_billing', 'lahore@khanpartners.pk', 91),
  ('Legal Axis Healthcare Desk', 'Karachi', 'medical_billing', 'care@legalaxis.pk', 88),
  ('Punjab Medical Claims Law', 'Islamabad', 'medical_billing', 'claims@pmclaw.pk', 85)
on conflict do nothing;
