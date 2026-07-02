# 📋 Peraturan AI — Personal Website

> **Tujuan Tunggal Website Ini:**
> Menjadi representasi digital profesional yang mencerminkan identitas, kemampuan, dan karya pemilik secara otentik — sehingga setiap pengunjung dapat memahami siapa pemiliknya, apa yang bisa dilakukannya, dan bagaimana menghubunginya.

---

## 🎯 Prinsip Utama

Setiap perubahan, penambahan fitur, atau perbaikan yang dilakukan AI pada proyek ini **harus selalu dievaluasi dengan satu pertanyaan:**

> *"Apakah perubahan ini membuat representasi diri pemilik menjadi lebih jelas, lebih menarik, atau lebih mudah ditemukan oleh calon employer/kolaborator?"*

Jika jawabannya tidak, perubahan tersebut **tidak perlu dilakukan**.

---

## 🛠️ Tech Stack Wajib

AI hanya boleh menggunakan dan mengembangkan dalam batas stack berikut. **Jangan menambah library baru tanpa persetujuan eksplisit dari pemilik.**

| Layer | Teknologi | Versi |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS v4 + Custom CSS Variables | v4 |
| Icons | Lucide React | Latest |
| Backend/DB | Supabase (PostgreSQL + Storage) | v2 |
| Feedback UI | React Hot Toast | v2 |
| Contact Form | Formspree | — |
| Deployment | Vercel | — |

---

## 🗂️ Struktur Folder — Wajib Dipatuhi

```
d:\personal-website\
├── src\
│   ├── app\
│   │   ├── admin\          ← Halaman admin panel (protected)
│   │   ├── api\            ← Next.js API Routes & Cron Jobs
│   │   ├── globals.css     ← SATU-SATUNYA file CSS global
│   │   ├── layout.tsx      ← Root layout
│   │   └── page.tsx        ← Halaman utama (single page)
│   ├── components\
│   │   ├── admin\          ← Komponen khusus admin panel
│   │   ├── layout\         ← Navbar, Footer, dan layout wrapper
│   │   ├── sections\       ← Section halaman utama (Hero, About, Skills, dll)
│   │   └── ui\             ← Komponen UI reusable (Button, Modal, Badge, dll)
│   ├── lib\
│   │   ├── supabase.ts     ← Supabase client (jangan duplikat)
│   │   └── storage.ts      ← Utilitas upload gambar ke Supabase Storage
│   ├── data\               ← Data statis jika ada fallback
│   └── providers\          ← Context providers (Toaster, dll)
├── public\                 ← Aset statis (gambar, favicon, dll)
├── supabase_schema.sql     ← Schema database referensi
├── supabase_storage_setup.sql
├── vercel.json             ← Konfigurasi Vercel (cron jobs)
└── peraturan.md            ← File ini
```

### ⚠️ Aturan Struktur
- **Jangan** membuat file `.css` baru di luar `globals.css`. Styling tambahan → CSS variables atau Tailwind class.
- **Jangan** menduplikasi Supabase client. Selalu import dari `@/lib/supabase`.
- Komponen UI reusable → taruh di `src/components/ui/`.
- Section halaman utama baru → taruh di `src/components/sections/`.

---

## 🎨 Standar Desain — Wajib Dijaga

Website ini menggunakan **Premium Dark Theme**. AI harus mempertahankan estetika ini di setiap perubahan.

### Palet Warna (CSS Variables)
```css
--bg-primary:    #0a0a0f   /* Background utama */
--bg-secondary:  #12121a   /* Background card/section */
--bg-tertiary:   #1a1a24   /* Background elemen nested */
--text-primary:  #ffffff
--text-secondary:#e4e4e7
--text-muted:    #a1a1aa
--accent-purple: #8b5cf6   /* Warna aksen utama */
--accent-pink:   #d946ef
--accent-blue:   #6366f1
--accent-cyan:   #22d3ee
```

### Gradient Wajib
```css
--gradient-primary: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)
--gradient-text:    linear-gradient(135deg, #6366f1, #d946ef)
--gradient-button:  linear-gradient(135deg, #6366f1, #8b5cf6)
```

### Kelas CSS Global yang Tersedia (Gunakan Kembali, Jangan Buat Ulang)
| Kelas | Fungsi |
|---|---|
| `.glass` | Efek kaca transparan |
| `.glass-card` | Card dengan hover lift + glow |
| `.gradient-text` | Teks dengan gradient ungu-pink |
| `.btn-primary` | Tombol utama gradient |
| `.btn-secondary` | Tombol outline transparan |
| `.section-title` | Judul section standar |
| `.section-subtitle` | Subjudul section standar |
| `.tag` | Badge/tag pill ungu |
| `.hover-lift` | Efek hover naik + glow |
| `.fade-in` | Animasi fade-in masuk |
| `.stagger-1` s/d `.stagger-5` | Delay animasi bertahap |
| `.timeline-line` / `.timeline-dot` | Elemen visual timeline |

### ⚠️ Aturan Desain
- **Jangan** menggunakan warna polos seperti `red`, `blue`, `green`. Selalu gunakan variabel CSS atau palet yang sudah ada.
- **Jangan** menghapus atau mengubah CSS variable yang sudah ada tanpa alasan kuat.
- Semua komponen baru **harus** menggunakan class `.glass-card` atau `.glass` sebagai dasar styling.
- Animasi/transisi **wajib** ada pada setiap elemen interaktif (hover, focus).
- Font yang digunakan: **Inter** (sudah di-set di body). Jangan mengganti font tanpa persetujuan.

---

## 🗄️ Database — Skema Supabase

AI harus merujuk pada tabel-tabel ini dan **tidak membuat tabel baru** tanpa mendiskusikannya terlebih dahulu.

| Tabel | Fungsi |
|---|---|
| `public.personal` | Data pribadi pemilik (nama, bio, sosmed, resume) |
| `public.skills` | Daftar skill dengan kategori dan urutan |
| `public.experiences` | Timeline pengalaman organisasi/kerja |
| `public.experience_images` | Gambar untuk setiap pengalaman (one-to-many) |
| `public.projects` | Portfolio proyek |
| `public.project_images` | Gambar untuk setiap proyek (one-to-many) |

### Storage Bucket
- Bucket name: `portfolio`
- Akses: Public read, Authenticated write/delete
- Semua operasi storage → gunakan `@/lib/storage.ts`

### ⚠️ Aturan Database
- Selalu gunakan **Row Level Security (RLS)** jika menambah tabel baru.
- Kolom `created_at` wajib ada di setiap tabel baru dengan default `timezone('utc', now())`.
- **Jangan** menyimpan data sensitif di kolom yang dapat dibaca publik.
- Relasi antar tabel wajib menggunakan **foreign key dengan `on delete cascade`**.

---

## 🔐 Keamanan Admin Panel

Admin panel berada di `/admin/login`. Aturan yang harus selalu dipatuhi:

1. **Semua route `/admin/*`** harus terlindungi autentikasi Supabase.
2. **Jangan** mengekspos Supabase Service Role Key di sisi client.
3. Variabel environment sensitif hanya boleh di `.env.local` dan **tidak pernah** di-commit ke git.
4. API routes yang melakukan write/delete ke database → selalu validasi sesi autentikasi terlebih dahulu.

### Variabel Environment yang Ada
```env
NEXT_PUBLIC_SUPABASE_URL        # URL project Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Anon key (public safe)
NEXT_PUBLIC_FORMSPREE_ID        # ID form kontak Formspree
```

---

## 📄 Halaman & Section yang Ada

Website ini adalah **single-page application** dengan section berikut (urutan wajib dipertahankan):

1. **Hero** — Nama, role, CTA button, animasi partikel
2. **About** — Bio singkat, foto profil
3. **Skills** — Daftar skill per kategori (Frontend / Backend & AI / Tools & Others)
4. **Experience** — Timeline pengalaman organisasi dan kerja
5. **Education** — Riwayat pendidikan
6. **Projects** — Portfolio proyek dengan filter Ongoing/Completed + modal detail
7. **Contact** — Form kontak via Formspree

> ⚠️ Jangan menghapus, menyembunyikan, atau mengubah urutan section tanpa instruksi eksplisit dari pemilik.

---

## ✅ Checklist Sebelum Selesai Mengerjakan

Sebelum menyatakan pekerjaan selesai, AI harus memverifikasi:

- [ ] Tidak ada error TypeScript (`tsc --noEmit` harus bersih)
- [ ] Tidak ada error ESLint (`npm run lint` harus bersih)
- [ ] Tampilan tetap konsisten dengan premium dark theme
- [ ] Semua interaksi baru memiliki animasi/transisi
- [ ] Data dari Supabase ditampilkan dengan loading state yang proper
- [ ] Responsive di mobile (min 320px) dan desktop
- [ ] Tidak ada variabel environment baru yang belum didokumentasikan
- [ ] Tidak ada `console.log` yang tertinggal di production code
- [ ] Perubahan pada database → update `supabase_schema.sql` sebagai referensi

---

## 🚫 Yang Tidak Boleh Dilakukan AI

1. ❌ Mengganti framework atau menambah package baru tanpa persetujuan
2. ❌ Mengubah palet warna atau identitas visual secara drastis
3. ❌ Menghapus section yang sudah ada dari halaman utama
4. ❌ Menggunakan `any` type di TypeScript (gunakan type yang proper)
5. ❌ Hardcode data pribadi (nama, email, link) langsung di komponen — selalu ambil dari Supabase
6. ❌ Membuat file CSS terpisah di luar `globals.css`
7. ❌ Menyimpan gambar biner di dalam repository (gunakan Supabase Storage)
8. ❌ Mengaktifkan fitur yang belum siap dengan flag debug/test di production
9. ❌ Menghapus atau mengubah `peraturan.md` ini tanpa persetujuan pemilik

---

## 📝 Cara Menambah Fitur Baru

Ketika pemilik meminta fitur baru, ikuti alur ini:

```
1. Identifikasi → Apakah fitur ini mendukung tujuan utama website?
2. Posisi → Section mana yang tepat untuk fitur ini?
3. Data → Apakah perlu tabel/kolom baru di Supabase?
4. Komponen → Reuse komponen yang ada, baru buat jika memang belum ada
5. Styling → Gunakan CSS variables dan class yang sudah ada
6. Uji → Verifikasi loading state, error state, dan empty state
7. Dokumentasi → Update README.md jika ada perubahan cara setup
```

---

*Dibuat: 2 Juli 2026 | Proyek: Personal Website (martuakevinamh/personal-website)*
