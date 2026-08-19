-- Gulf Job Hub - initial schema
create extension if not exists pgcrypto;

create type job_status as enum ('draft','published','expired');
create type employment_type as enum ('full_time','part_time','contract','temporary','internship');
create type event_type as enum ('view','apply_click','whatsapp_click','email_click','call_click');
create type user_role as enum ('jobseeker');

create table countries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table locations (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references countries(id) on delete cascade,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  unique (country_id, name)
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  created_at timestamptz not null default now()
);

create table admins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role user_role not null default 'jobseeker',
  created_at timestamptz not null default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  title text not null,
  slug text not null unique,
  company_id uuid references companies(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  country_id uuid references countries(id) on delete set null,
  location_id uuid references locations(id) on delete set null,
  employment_type employment_type not null default 'full_time',
  experience_min int,
  experience_max int,
  salary_min numeric,
  salary_max numeric,
  salary_currency text not null default 'USD',
  salary_is_visible boolean not null default true,
  description text not null,
  responsibilities text,
  requirements text,
  qualifications text,
  benefits text,
  whatsapp_number text,
  contact_email text,
  phone_number text,
  application_deadline date,
  published_date date not null default current_date,
  status job_status not null default 'draft',
  views_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index jobs_status_idx on jobs(status);
create index jobs_category_idx on jobs(category_id);
create index jobs_country_idx on jobs(country_id);
create index jobs_location_idx on jobs(location_id);
create index jobs_published_idx on jobs(published_date desc);
create index jobs_search_idx on jobs using gin (
  to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))
);

create table job_events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  event_type event_type not null,
  created_at timestamptz not null default now()
);
create index job_events_job_idx on job_events(job_id);
create index job_events_type_idx on job_events(event_type);

create table search_queries (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  results_count int not null default 0,
  created_at timestamptz not null default now()
);

create table site_settings (
  id int primary key default 1,
  site_name text not null default 'Gulf Job Hub',
  tagline text not null default 'Find Your Next Career in the Gulf',
  logo_url text,
  contact_email text not null default 'info@gulfjobhub.com',
  whatsapp_number text,
  phone_number text,
  social_links jsonb not null default '{}',
  seo_title text not null default 'Gulf Job Hub - Find Your Next Career in the Gulf',
  seo_description text not null default 'Discover the latest jobs across Saudi Arabia, UAE, Qatar, Kuwait, Bahrain and Oman.',
  ad_slots jsonb not null default '{"header_enabled":false,"homepage_enabled":false,"jobs_page_enabled":false,"job_details_enabled":false,"sidebar_enabled":false,"header_code":"","homepage_code":"","jobs_page_code":"","job_details_code":"","sidebar_code":""}',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1) on conflict do nothing;

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger jobs_set_updated_at before update on jobs
  for each row execute function set_updated_at();
create trigger settings_set_updated_at before update on site_settings
  for each row execute function set_updated_at();
