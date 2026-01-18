# Personal Website

Website portfolio personal yang modern dan dinamis, dibangun dengan **Next.js 15**, **Tailwind CSS v4**, dan **Supabase** sebagai backend.

## 🚀 Demo

[Live Demo](https://personal-website.vercel.app/)

## ✨ Fitur

### Frontend (Public)

- **Hero Section**: Perkenalan dengan animasi modern.
- **About**: Informasi personal dinamis.
- **Skills**: Menampilkan skill berdasarkan kategori (Frontend, Backend, Tools).
- **Experience**: Timeline pengalaman organisasi dan kerja.
- **Projects**: Showcase portfolio proyek dengan filter status (Ongoing/Completed).
- **Contact**: Form kontak terintegrasi dengan Formspree.
- **Responsive**: Desain optimal di semua perangkat (Mobile/Desktop).
- **Dark Mode**: Desain gelap yang elegan.

### Admin Dashboard (`/admin/login`)

- **Authentication**: Login aman untuk admin.
- **Manage Experiences**: Tambah, edit, hapus pengalaman + upload gambar multiple.
- **Manage Skills**: Kelola daftar skill dan kategori.
- **Manage Projects**: Atur portfolio, status proyek, dan spotlight.
- **Manage Personal Info**: Update profil, bio, dan link sosial media secara realtime.
- **Image Management**: Upload dan manajemen posisi (focal point) gambar.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **Backend**: Supabase (PostgreSQL Database & Storage)
- **State Feedback**: React Hot Toast
- **Deployment**: Vercel

## 🏃 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/martuakevinamh/personal-website.git
cd personal-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root folder dan isi dengan konfigurasi berikut:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Formspree (Contact Form)
NEXT_PUBLIC_FORMSPREE_ID=your_formspree_id
```

### 4. Setup Database (Supabase)

Project ini menggunakan Supabase sebagai database dan storage.

1.  Buat project baru di [Supabase dashboard](https://supabase.com/dashboard).
2.  Buka SQL Editor di Supabase.
3.  Jalankan script dari file `supabase_schema.sql` untuk membuat tabel-tabel yang dibutuhkan.
4.  Jalankan script dari file `supabase_storage_setup.sql` untuk mengatur Storage bucket dan policy.

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk frontend dan [http://localhost:3000/admin/login](http://localhost:3000/admin/login) untuk panel admin.

## 📂 Struktur Folder Utama

```
src/
├── app/
│   ├── admin/      # Halaman Admin Panel (Protected)
│   ├── api/        # Next.js API Routes (jika ada)
│   ├── components/ # Reusable UI Components
│   └── page.tsx    # Halaman Utama (Home)
├── lib/
│   ├── supabase.ts # Client Supabase
│   └── storage.ts  # Utilitas Upload Gambar
└── providers/      # Context Providers (e.g. Toaster)
```

## 📄 License

# MIT License
