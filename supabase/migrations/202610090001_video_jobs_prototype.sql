-- Avatar Studio AI: video jobs metadata for the prototype.
-- Review and apply ONLY in a non-production Supabase environment.
-- This migration intentionally does not create buckets or start AI processing.

create table if not exists public.video_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('library', 'upload')),
  source_template_id text,
  input_storage_path text,
  output_storage_path text,
  avatar_id uuid references public.avatars(id) on delete set null,
  status text not null default 'queued'
    check (status in ('queued', 'uploading', 'processing', 'succeeded', 'failed', 'cancelled')),
  progress smallint not null default 0 check (progress between 0 and 100),
  provider text,
  model text,
  error_code text,
  error_message text,
  input_duration_seconds numeric(8,2),
  input_size_bytes bigint check (input_size_bytes is null or input_size_bytes >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  constraint video_jobs_source_valid check (
    (source_type = 'library' and source_template_id is not null)
    or (source_type = 'upload')
  ),
  constraint video_jobs_upload_has_path check (
    source_type <> 'upload' or input_storage_path is null or input_storage_path like user_id::text || '/%'
  ),
  constraint video_jobs_output_owner_path check (
    output_storage_path is null or output_storage_path like user_id::text || '/%'
  )
);

create index if not exists video_jobs_user_created_idx
  on public.video_jobs (user_id, created_at desc);
create index if not exists video_jobs_queue_idx
  on public.video_jobs (status, created_at)
  where status in ('queued', 'uploading');

alter table public.video_jobs enable row level security;

drop policy if exists "Users can read their own video jobs" on public.video_jobs;
create policy "Users can read their own video jobs"
  on public.video_jobs for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own video jobs" on public.video_jobs;
create policy "Users can create their own video jobs"
  on public.video_jobs for insert
  with check (
    auth.uid() = user_id
    and status = 'queued'
    and progress = 0
    and provider is null
    and model is null
    and output_storage_path is null
    and error_code is null
    and error_message is null
  );

-- Users deliberately cannot update job status, paths, progress, or output.
-- A trusted server/worker using the Supabase service role will manage lifecycle fields.
-- Do not expose the service-role key in the browser.
