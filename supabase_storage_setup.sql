-- 1. Create 'portfolio' bucket (if it doesn't exist)
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- 2. Setup RLS Policies for 'portfolio' bucket

-- ALLOW PUBLIC READ (Anyone can view images)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'portfolio' );

-- ALLOW AUTHENTICATED UPLOAD (Only logged in users can upload)
-- Note: 'authenticated' role is used by Supabase Auth.
create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'portfolio' );

-- ALLOW UPDATE (Edit/overwrite own uploads or as admin)
create policy "Authenticated Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'portfolio' );

-- ALLOW DELETE (Remove images)
create policy "Authenticated Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'portfolio' );
