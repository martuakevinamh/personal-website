-- 1. Create 'portfolio' bucket (if it doesn't exist)
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- 2. Setup RLS Policies for 'portfolio' bucket

-- ALLOW PUBLIC READ (Anyone can view images)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'portfolio' );

-- ⚠️ EMAIL ADMIN SUDAH DIISI OTOMATIS: kevinlubis2909@gmail.com
-- (diambil dari data publik tabel personal). SEBELUM menjalankan file ini,
-- PASTIKAN email tersebut SAMA dengan email login Supabase Auth yang dipakai
-- di /admin/login. Jika berbeda, ganti semua 'kevinlubis2909@gmail.com'
-- pada policy di bawah dengan email login yang benar.
--
-- MENGAPA DIPERKETAT:
-- Policy lama memberi akses upload/update/delete ke SEMUA user terautentikasi,
-- artinya siapa pun yang punya akun di project ini bisa menghapus/mengganti
-- SEMUA gambar di bucket. Policy baru membatasinya ke pemilik (email admin).

-- ALLOW ADMIN UPLOAD (Only the admin user can upload)
-- Note: 'authenticated' role is used by Supabase Auth.
drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Admin Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'portfolio' and auth.jwt() ->> 'email' = 'kevinlubis2909@gmail.com' );

-- ALLOW ADMIN UPDATE (Edit/overwrite)
drop policy if exists "Authenticated Update" on storage.objects;
create policy "Admin Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'portfolio' and auth.jwt() ->> 'email' = 'kevinlubis2909@gmail.com' );

-- ALLOW ADMIN DELETE (Remove images)
drop policy if exists "Authenticated Delete" on storage.objects;
create policy "Admin Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'portfolio' and auth.jwt() ->> 'email' = 'kevinlubis2909@gmail.com' );
