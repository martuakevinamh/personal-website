// Experience Data - Edit this file to update your organizational & committee experience

export interface Experience {
  id: number;
  title: string; // Posisi/jabatan
  organization: string; // Nama organisasi/kepanitiaan
  type: "organization" | "committee"; // Tipe: organisasi atau kepanitiaan
  startDate: string; // Tanggal mulai
  endDate: string; // Tanggal selesai atau "Sekarang"
  description: string; // Deskripsi tugas/tanggung jawab
  images: string[]; // Array path gambar bukti kegiatan
}

export const experienceData: Experience[] = [
  // Organisasi
  {
    id: 1,
    title: "Kepala Departemen Creative Media & IT",
    organization: "Persekutuan Mahasiswa Kristen (PMK) Institut Teknologi Sumatera",
    type: "organization",
    startDate: "2024",
    endDate: "2025",
    description: "Memimpin Departemen Creative Media & IT dalam mengelola seluruh platform digital organisasi. Bertanggung jawab dalam pengembangan, mengelola konten sosial media (Instagram, Tiktok), serta merancang strategi digital untuk meningkatkan engagement dan jangkauan publikasi kegiatan organisasi.",
    images: [
      "/images/experience/org-1-1.jpg",
      "/images/experience/org-1-2.jpg",
    ],
  },
  {
    id: 2,
    title: "Kepala Divisi Logistik (Departemen Operasional)",
    organization: "Persekutuan Mahasiswa Kristen (PMK) Institut Teknologi Sumatera",
    type: "organization",
    startDate: "2022",
    endDate: "Sekarang",
    description: "Mengkoordinasikan seluruh kebutuhan logistik dan inventaris untuk kegiatan PMK ITERA. Bertanggung jawab dalam pengadaan, pendataan, dan pemeliharaan aset organisasi. Mengelola sistem peminjaman peralatan serta memastikan kelancaran operasional setiap acara yang diselenggarakan.",
    images: [
      "/images/experience/org-2-1.jpg",
    ],
  },
  {
    id: 3,
    title: "Staff Komisi Aspirasi",
    organization: "Himpunan Mahasiswa Informatika (HMIF) Institut Teknologi Sumatera",
    type: "organization",
    startDate: "2024",
    endDate: "2025",
    description: "Berperan aktif dalam menjembatani komunikasi antara mahasiswa Informatika dengan pihak jurusan dan institusi. Mengumpulkan, menganalisis, dan menyalurkan aspirasi mahasiswa terkait akademik, fasilitas, dan kegiatan kemahasiswaan. Turut serta dalam penyusunan program kerja yang berorientasi pada kebutuhan mahasiswa.",
    images: [
      "/images/experience/org-3-1.jpg",
    ],
  },
  // Kepanitiaan
  {
    id: 4,
    title: "Ketua Pelaksana PICC",
    organization: "Persekutuan Mahasiswa Kristen (PMK) Institut Teknologi Sumatera",
    type: "committee",
    startDate: "2025",
    endDate: "2025",
    description: "Memimpin dan mengkoordinasikan seluruh rangkaian kegiatan PICC (PMK ITERA Christian Camp). Bertanggung jawab dalam perencanaan, penganggaran, dan eksekusi acara. Mengelola tim panitia lintas divisi untuk memastikan keberhasilan pelaksanaan retreat tahunan yang diikuti oleh seluruh anggota PMK ITERA.",
    images: [
      "/images/experience/com-1-1.jpg",
      "/images/experience/com-1-2.jpg",
    ],
  },
  {
    id: 5,
    title: "Asisten Dosen Agama Kristen Protestan",
    organization: "Institut Teknologi Sumatera",
    type: "committee",
    startDate: "2025",
    endDate: "2025",
    description: "Mendampingi dosen dalam pelaksanaan perkuliahan Pendidikan Agama Kristen Protestan. Membantu dalam penyusunan materi pembelajaran, memeriksa tugas mahasiswa, dan memfasilitasi diskusi kelas. Berperan sebagai penghubung antara mahasiswa dan dosen untuk memastikan proses belajar mengajar yang efektif.",
    images: [
      "/images/experience/com-2-1.jpg",
    ],
  },
];
