-- Row Level Security
-- All database access from this application happens exclusively through
-- trusted server-side code (Next.js Route Handlers / Server Components).
-- The Supabase key used by the server is never sent to the browser.
-- Authorization (who may write) is enforced in the application layer
-- (signed, httpOnly session cookies checked in every admin API route).
-- RLS below still restricts direct/API access to the sensitive tables.

alter table countries enable row level security;
alter table locations enable row level security;
alter table categories enable row level security;
alter table companies enable row level security;
alter table jobs enable row level security;
alter table job_events enable row level security;
alter table search_queries enable row level security;
alter table site_settings enable row level security;
alter table admins enable row level security;
alter table users enable row level security;

-- Public read access for catalog/reference data
create policy "public read countries" on countries for select using (true);
create policy "public read locations" on locations for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read companies" on companies for select using (true);
create policy "public read published jobs" on jobs for select using (true);
create policy "public read settings" on site_settings for select using (true);

-- Server-mediated writes (service role / server key only; no anon-key
-- write policies are defined, so writes require the server's elevated key)
create policy "server manage countries" on countries for all using (auth.role() = 'service_role');
create policy "server manage locations" on locations for all using (auth.role() = 'service_role');
create policy "server manage categories" on categories for all using (auth.role() = 'service_role');
create policy "server manage companies" on companies for all using (auth.role() = 'service_role');
create policy "server manage jobs" on jobs for all using (auth.role() = 'service_role');
create policy "server manage settings" on site_settings for all using (auth.role() = 'service_role');
create policy "server manage admins" on admins for all using (auth.role() = 'service_role');
create policy "server manage users" on users for all using (auth.role() = 'service_role');

create policy "server manage job_events" on job_events for all using (auth.role() = 'service_role');
create policy "server insert job_events" on job_events for insert with check (true);
create policy "server manage search_queries" on search_queries for all using (auth.role() = 'service_role');
create policy "server insert search_queries" on search_queries for insert with check (true);
