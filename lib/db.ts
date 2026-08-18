import fs from "fs";
import path from "path";
import os from "os";
import type { Project, Certificate, MediaItem, ProfileInfo, SkillGroup, StudioHealth } from "./types";

interface DatabaseSchema {
  projects: Project[];
  certificates: Certificate[];
  media: MediaItem[];
  profile: ProfileInfo;
  skills: SkillGroup[];
  version: number;
}

const INITIAL_PROFILE: ProfileInfo = {
  name: "Daffa",
  fullName: "Muhamad Daffa Permana",
  role: "Junior Software Developer",
  bio: "Pelajar dengan minat mendalam di Software Development, khususnya Back-End Development, serta pengalaman membangun aplikasi web, desktop, dan mobile menggunakan teknologi modern.",
  about: [
    "Saya adalah pelajar yang memiliki minat besar di bidang Software Development, khususnya Back-End Development. Saya berpengalaman dalam membuat aplikasi web, desktop, dan mobile menggunakan berbagai teknologi modern.",
    "Saya selalu ingin belajar hal-hal baru, memecahkan masalah, dan membangun solusi yang bermanfaat."
  ],
  location: "Parongpong, Jawa Barat, Indonesia",
  email: "permanadaffa89@gmail.com",
  github: "https://github.com/Daffa-exp",
  avatarUrl: "/assets/photo.jpg",
  education: [
    { period: "2024 — Sekarang", institution: "SMK Negeri 1 Cisarua", field: "Rekayasa Perangkat Lunak" },
    { period: "2021 — 2024", institution: "MTs As Shofa Cisarua", field: "Pendidikan Menengah" },
    { period: "2015 — 2021", institution: "SD Negeri Kancah", field: "Pendidikan Dasar" }
  ]
};

const INITIAL_SKILLS: SkillGroup[] = [
  { group: "PROGRAMMING", items: ["HTML", "CSS", "JavaScript", "Python", "PHP", "Dart", "TypeScript"] },
  { group: "FRAMEWORKS / TOOLS", items: ["Next.js", "React", "Express.js", "Node.js", "Laravel", "Flutter", "Flask", "Tailwind CSS", "Electron"] },
  { group: "DATABASE", items: ["MySQL", "Firebase", "Supabase", "Prisma"] },
  { group: "DEVELOPMENT", items: ["AI-assisted Development", "Docker", "Git"] }
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: "foodmart",
    slug: "foodmart",
    title: "Foodmart",
    category: "FULL-STACK WEB",
    tagline: "Platform pemesanan makanan online",
    shortDescription: "Website pemesanan makanan dengan katalog menu, promo, sistem keranjang, pembayaran, dan dashboard admin.",
    fullDescription: "Website pemesanan makanan dengan katalog menu, promo, sistem keranjang, dan manajemen pesanan. Frontend dan backend dipisah sebagai dua service independen, backend menyediakan REST API yang di-deploy sebagai serverless function di Vercel.",
    role: "Full-Stack Developer",
    teamSize: 1,
    collaborationDescription: "Dikerjakan mandiri sebagai proyek eksplorasi full-stack web.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Vercel"],
    features: ["Katalog menu interaktif", "Sistem keranjang belanja", "Promo & voucher", "Checkout & simulasi pembayaran", "Dashboard admin"],
    challenges: ["Pemisahan arsitektur frontend dan backend yang efisien untuk deployment serverless."],
    solutions: ["Menerapkan arsitektur REST API modular yang di-deploy terpisah di Vercel."],
    results: ["Aplikasi live dan berfungsi penuh untuk simulasi transaksi."],
    projectUrl: "https://food-mart-ty91.vercel.app/",
    coverImage: "/assets/projects/foodmart/1.webp",
    galleryImages: [
      "/assets/projects/foodmart/1.webp",
      "/assets/projects/foodmart/2.webp",
      "/assets/projects/foodmart/3.webp"
    ],
    featured: true,
    order: 1,
    createdAt: "2024-03-01T00:00:00.000Z",
    updatedAt: "2024-03-01T00:00:00.000Z"
  },
  {
    id: "instanpage",
    slug: "instanpage",
    title: "InstanPage",
    category: "FULL-STACK WEB",
    tagline: "Pembuat landing page instan untuk UMKM & campaign",
    shortDescription: "Aplikasi untuk membuat landing page promosi dengan template siap pakai untuk produk, jasa, event, kelas, dan campaign.",
    fullDescription: "Aplikasi landing page builder modern untuk UMKM dan campaign digital. Dikembangkan secara kolaboratif bersama 2 rekan tim (tim 3 orang). Aplikasi mendukung kustomisasi template, manajemen database relasional, workflow kontainerisasi, dan otomatisasi pengujian.",
    role: "Full-Stack & Backend Contributor",
    teamSize: 3,
    collaborationDescription: "Dikembangkan secara kolaboratif dalam tim 3 orang. Tanggung jawab meliputi perancangan API backend, skema database relasional Prisma/MySQL, integrasi kontainer Docker, serta penulisan automated test menggunakan Vitest bersama rekan tim.",
    technologies: ["Next.js", "React", "Express.js", "MySQL", "Prisma", "Docker", "Vitest", "Tailwind CSS"],
    features: ["Template siap pakai beragam kategori", "Live preview visual editor", "Manajemen data lead/kontak", "Integrasi database terstruktur", "Containerized deployment"],
    challenges: ["Koordinasi tim dalam sinkronisasi skema database dan konsistensi API response."],
    solutions: ["Penggunaan Prisma ORM untuk skema tersentralisasi dan Docker Compose untuk konsistensi lingkungan lokal."],
    results: ["Berhasil meluncurkan sistem full-stack dengan reliabilitas tinggi dan kode teruji."],
    projectUrl: "https://instant-page-full-system.vercel.app/",
    coverImage: "/assets/projects/instanpage/1.webp",
    galleryImages: [
      "/assets/projects/instanpage/1.webp"
    ],
    featured: true,
    order: 2,
    createdAt: "2024-04-10T00:00:00.000Z",
    updatedAt: "2024-04-10T00:00:00.000Z"
  },
  {
    id: "pariwisata",
    slug: "pariwisata",
    title: "Pariwisata",
    category: "WEB EXPERIENCE",
    tagline: "Website eksplorasi wisata & booking di Jakarta",
    shortDescription: "Website pariwisata dengan destinasi, kuliner, journal, galeri, pemesanan tiket, dan booking hotel.",
    fullDescription: "Website pariwisata dengan destinasi, kuliner, journal, galeri, pemesanan tiket, dan booking hotel. Dibangun murni menggunakan HTML, CSS, dan JavaScript tanpa framework untuk memaksimalkan performa dan pemahaman dasar web.",
    role: "Frontend Developer",
    teamSize: 1,
    collaborationDescription: "Dikerjakan secara mandiri.",
    technologies: ["HTML", "CSS", "JavaScript"],
    features: ["Katalog destinasi wisata", "Panduan kuliner", "Travel journal & tips", "Sistem booking hotel & tiket", "Galeri foto interaktif"],
    challenges: ["Membangun interaktivitas kompleks dan navigasi mulus tanpa pustaka eksternal."],
    solutions: ["Optimalisasi DOM manipulation dan modularisasi skrip vanilla JavaScript."],
    results: ["Situs yang sangat cepat, responsif di semua perangkat, dan informatif."],
    projectUrl: "https://soft-florentine-811c65.netlify.app/",
    coverImage: "/assets/projects/pariwisata/1.webp",
    galleryImages: [
      "/assets/projects/pariwisata/1.webp",
      "/assets/projects/pariwisata/2.webp",
      "/assets/projects/pariwisata/3.webp",
      "/assets/projects/pariwisata/4.webp",
      "/assets/projects/pariwisata/5.webp",
      "/assets/projects/pariwisata/6.webp",
      "/assets/projects/pariwisata/7.webp"
    ],
    featured: true,
    order: 3,
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  },
  {
    id: "kaskelas",
    slug: "kaskelas",
    title: "Kas Kelas",
    category: "DESKTOP APP",
    tagline: "Sistem manajemen keuangan kelas digital",
    shortDescription: "Aplikasi desktop untuk mengelola kas kelas, tunggakan dan kredit siswa, grafik analitik keuangan, pembayaran QR code, serta export laporan.",
    fullDescription: "Aplikasi desktop untuk mengelola kas kelas: tunggakan & kredit per siswa, grafik analitik keuangan real-time, pembayaran via QR code, dan export laporan ke Excel/CSV. Dibuat untuk kebutuhan operasional SMKN 1 Cisarua.",
    role: "Desktop & Backend Developer",
    teamSize: 1,
    technologies: ["Electron", "Node.js", "Express"],
    coverImage: "/assets/projects/kaskelas/1.webp",
    galleryImages: Array.from({ length: 6 }, (_, i) => `/assets/projects/kaskelas/${i + 1}.webp`),
    featured: false,
    order: 4,
    createdAt: "2024-02-01T00:00:00.000Z",
    updatedAt: "2024-02-01T00:00:00.000Z"
  },
  {
    id: "hubin",
    slug: "hubin",
    title: "Hubin",
    category: "DESKTOP APP",
    tagline: "Pengelolaan hubungan industri sekolah",
    shortDescription: "Aplikasi desktop untuk mengelola data siswa PKL, kunjungan industri, dan MoU sekolah, lengkap dengan alur pengelolaan data.",
    fullDescription: "Aplikasi desktop untuk mengelola data siswa PKL, kunjungan industri, dan MoU sekolah, lengkap dengan fitur import-export data ke format Excel.",
    role: "Desktop Developer",
    teamSize: 1,
    technologies: ["Electron", "Express"],
    coverImage: "/assets/projects/hubin/1.webp",
    galleryImages: Array.from({ length: 3 }, (_, i) => `/assets/projects/hubin/${i + 1}.webp`),
    featured: false,
    order: 5,
    createdAt: "2024-02-15T00:00:00.000Z",
    updatedAt: "2024-02-15T00:00:00.000Z"
  },
  {
    id: "exam",
    slug: "exam",
    title: "Exam Monitoring System",
    category: "AI / COMPUTER VISION",
    tagline: "Pemantauan ujian berbasis AI",
    shortDescription: "Sistem monitoring ujian yang memanfaatkan deteksi wajah untuk membantu pemantauan peserta secara real-time.",
    fullDescription: "Sistem monitoring ujian yang mendeteksi keberadaan dan posisi wajah peserta secara real-time menggunakan face landmark detection, untuk membantu mengurangi potensi kecurangan saat ujian online.",
    role: "AI & Backend Developer",
    teamSize: 1,
    technologies: ["Python", "Flask", "OpenCV", "MediaPipe"],
    coverImage: "/assets/projects/exam/1.webp",
    galleryImages: ["/assets/projects/exam/1.webp"],
    featured: false,
    order: 6,
    createdAt: "2024-05-01T00:00:00.000Z",
    updatedAt: "2024-05-01T00:00:00.000Z"
  },
  {
    id: "galerifoto",
    slug: "galerifoto",
    title: "Galeri Foto Native",
    category: "WEB APP",
    tagline: "Galeri foto dengan sistem like & profil",
    shortDescription: "Aplikasi web galeri foto dengan autentikasi pengguna, upload foto, sistem like berbasis AJAX, dan halaman profil pengguna.",
    fullDescription: "Aplikasi web galeri foto dengan autentikasi pengguna, upload foto, sistem like interaktif berbasis AJAX, dan halaman profil pengguna.",
    role: "Full-Stack Developer",
    teamSize: 1,
    technologies: ["PHP", "MySQL", "AJAX"],
    coverImage: "/assets/projects/galerifoto/1.webp",
    galleryImages: Array.from({ length: 4 }, (_, i) => `/assets/projects/galerifoto/${i + 1}.webp`),
    featured: false,
    order: 7,
    createdAt: "2023-11-10T00:00:00.000Z",
    updatedAt: "2023-11-10T00:00:00.000Z"
  },
  {
    id: "phonebook",
    slug: "phonebook",
    title: "Web Phone Book",
    category: "WEB APP",
    tagline: "Manajemen kontak berbasis web",
    shortDescription: "Aplikasi pengelolaan kontak dengan login, tambah dan lihat data kontak lengkap dengan foto profil.",
    fullDescription: "Aplikasi pengelolaan kontak dengan sistem login, pencarian kontak, tambah dan lihat data kontak lengkap dengan foto profil masing-masing kontak.",
    role: "Full-Stack Developer",
    teamSize: 1,
    technologies: ["PHP", "MySQL"],
    coverImage: "/assets/projects/phonebook/1.webp",
    galleryImages: Array.from({ length: 5 }, (_, i) => `/assets/projects/phonebook/${i + 1}.webp`),
    featured: false,
    order: 8,
    createdAt: "2023-10-05T00:00:00.000Z",
    updatedAt: "2023-10-05T00:00:00.000Z"
  },
  {
    id: "webwedding",
    slug: "webwedding",
    title: "Web Wedding Invitation",
    category: "WEB EXPERIENCE",
    tagline: "Undangan pernikahan digital",
    shortDescription: "Undangan pernikahan digital interaktif dengan animasi pembuka dan tampilan modern.",
    fullDescription: "Undangan pernikahan digital interaktif dengan animasi pembuka yang elegan, peta lokasi terintegrasi, galeri foto mempelai, dan form RSVP.",
    role: "Frontend Developer",
    teamSize: 1,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    coverImage: "/assets/projects/webwedding/1.webp",
    galleryImages: Array.from({ length: 6 }, (_, i) => `/assets/projects/webwedding/${i + 1}.webp`),
    featured: false,
    order: 9,
    createdAt: "2024-06-12T00:00:00.000Z",
    updatedAt: "2024-06-12T00:00:00.000Z"
  },
  {
    id: "mobilelms",
    slug: "mobilelms",
    title: "Mobile LMS",
    category: "MOBILE APP",
    tagline: "Aplikasi pembelajaran online sederhana",
    shortDescription: "Aplikasi pembelajaran dengan kategori jenjang pendidikan, daftar kelas, dan sistem poin belajar.",
    fullDescription: "Aplikasi mobile pembelajaran yang menyediakan kategori berdasarkan jenjang pendidikan (SD hingga Mahasiswa), modul materi terstruktur, dan sistem poin reward.",
    role: "Mobile App Developer",
    teamSize: 1,
    technologies: ["Flutter", "Dart", "JavaScript", "Tailwind CSS"],
    coverImage: "/assets/projects/mobilelms/1.webp",
    galleryImages: Array.from({ length: 2 }, (_, i) => `/assets/projects/mobilelms/${i + 1}.webp`),
    featured: false,
    order: 10,
    createdAt: "2024-07-20T00:00:00.000Z",
    updatedAt: "2024-07-20T00:00:00.000Z"
  },
  {
    id: "jersey",
    slug: "jersey",
    title: "Pendataan Pembayaran DP",
    category: "UTILITY WEB",
    tagline: "Tools pencatatan pembayaran jersey kelas",
    shortDescription: "Tools ringan untuk mencatat pembayaran DP dan pelunasan, dengan progress pembayaran per orang.",
    fullDescription: "Tools ringan untuk mencatat pembayaran DP dan pelunasan pemesanan jersey kelas, menampilkan progress status per siswa dan export ringkasan.",
    role: "Frontend Developer",
    teamSize: 1,
    technologies: ["HTML", "JavaScript"],
    coverImage: "/assets/projects/jersey/1.webp",
    galleryImages: Array.from({ length: 2 }, (_, i) => `/assets/projects/jersey/${i + 1}.webp`),
    featured: false,
    order: 11,
    createdAt: "2023-09-15T00:00:00.000Z",
    updatedAt: "2023-09-15T00:00:00.000Z"
  },
  {
    id: "webpaslon",
    slug: "webpaslon",
    title: "Web Paslon OSIS",
    category: "WEB EXPERIENCE",
    tagline: "Halaman pemilihan Ketua & Wakil OSIS",
    shortDescription: "Halaman voting pemilihan Ketua dan Wakil OSIS dengan profil kandidat dan penghitungan suara.",
    fullDescription: "Halaman interaktif pemilihan Ketua & Wakil OSIS SMKN 1 Cisarua periode 2026-2027 yang menampilkan visi-misi kandidat dan sistem perhitungan suara.",
    role: "Frontend Developer",
    teamSize: 1,
    technologies: ["HTML", "JavaScript"],
    coverImage: "/assets/projects/webpaslon/1.webp",
    galleryImages: Array.from({ length: 2 }, (_, i) => `/assets/projects/webpaslon/${i + 1}.webp`),
    featured: false,
    order: 12,
    createdAt: "2023-11-20T00:00:00.000Z",
    updatedAt: "2023-11-20T00:00:00.000Z"
  },
  {
    id: "webbolu",
    slug: "webbolu",
    title: "Bolu Pinky",
    category: "E-COMMERCE",
    tagline: "E-commerce kue rumahan dengan live chat",
    shortDescription: "Website e-commerce bakery dengan katalog produk, keranjang, checkout, dan live chat real-time.",
    fullDescription: "Website e-commerce bakery bertema pastel dengan katalog varian kue, keranjang belanja, checkout order, dan integrasi live chat real-time berbasis Supabase.",
    role: "Full-Stack Developer",
    teamSize: 1,
    technologies: ["Supabase", "JavaScript", "Realtime Chat"],
    coverImage: "/assets/projects/webbolu/1.webp",
    galleryImages: Array.from({ length: 5 }, (_, i) => `/assets/projects/webbolu/${i + 1}.webp`),
    featured: false,
    order: 13,
    createdAt: "2024-03-25T00:00:00.000Z",
    updatedAt: "2024-03-25T00:00:00.000Z"
  },
  {
    id: "girlfriend",
    slug: "girlfriend",
    title: "Girlfriend",
    category: "INTERACTIVE WEB",
    tagline: "Eksperimen web interaktif",
    shortDescription: "Proyek eksplorasi antarmuka interaktif dengan visual dan animasi yang menjadi bagian dari kumpulan karya personal.",
    fullDescription: "Eksperimen web interaktif dengan elemen animasi visual halus yang dirancang sebagai bagian dari portofolio karya kreatif personal.",
    role: "Creative Developer",
    teamSize: 1,
    technologies: ["HTML", "CSS", "JavaScript"],
    coverImage: "/assets/projects/girlfriend/1.webp",
    galleryImages: Array.from({ length: 3 }, (_, i) => `/assets/projects/girlfriend/${i + 1}.webp`),
    featured: false,
    order: 14,
    createdAt: "2023-12-01T00:00:00.000Z",
    updatedAt: "2023-12-01T00:00:00.000Z"
  }
];

const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    title: "Dasar dan Penggunaan Generatif AI",
    issuer: "Codepolitan × AI Opportunity Fund Asia Pacific",
    issueDate: "22 April 2026",
    description: "Sertifikasi pemahaman fundamental generative AI, prompt engineering, dan penerapan model AI dalam produktivitas modern.",
    imageUrl: "/assets/certs/cert1.jpg",
    featured: true,
    order: 1,
    createdAt: "2026-04-22T00:00:00.000Z",
    updatedAt: "2026-04-22T00:00:00.000Z"
  },
  {
    id: "cert-2",
    title: "Introduction to Information Security",
    issuer: "Cyber Academy — Cyber Army Indonesia",
    issueDate: "8 Mei 2025",
    description: "Dasar-dasar keamanan informasi, prinsip confidentiality, integrity, availability (CIA triad), serta pencegahan celah keamanan aplikasi.",
    imageUrl: "/assets/certs/cert2.jpg",
    featured: true,
    order: 2,
    createdAt: "2025-05-08T00:00:00.000Z",
    updatedAt: "2025-05-08T00:00:00.000Z"
  },
  {
    id: "cert-3",
    title: "AI Ready ASEAN",
    issuer: "ASEAN Foundation × Google.org",
    issueDate: "22 Mei 2026",
    description: "Program literasi dan kecakapan kecerdasan buatan untuk kesiapan masa depan teknologi digital di kawasan ASEAN.",
    imageUrl: "/assets/certs/cert3.jpg",
    featured: true,
    order: 3,
    createdAt: "2026-05-22T00:00:00.000Z",
    updatedAt: "2026-05-22T00:00:00.000Z"
  },
  {
    id: "cert-4",
    title: "Belajar Dasar AI",
    issuer: "Dicoding Indonesia",
    issueDate: "2 November 2025",
    description: "Pemahaman konsep dasar Machine Learning, Deep Learning, Natural Language Processing, dan Computer Vision.",
    imageUrl: "/assets/certs/cert4.jpg",
    featured: true,
    order: 4,
    createdAt: "2025-11-02T00:00:00.000Z",
    updatedAt: "2025-11-02T00:00:00.000Z"
  },
  {
    id: "cert-5",
    title: "Ethical Hacker for Dummies",
    issuer: "Komdigi — Digital Talent Scholarship",
    issueDate: "7 Desember 2025",
    description: "Pelatihan teknik dasar ethical hacking, penetration testing awareness, dan mitigasi vulnerabilitas sistem.",
    imageUrl: "/assets/certs/cert5.jpg",
    featured: true,
    order: 5,
    createdAt: "2025-12-07T00:00:00.000Z",
    updatedAt: "2025-12-07T00:00:00.000Z"
  },
  {
    id: "cert-6",
    title: "AI Engineer for Milenial",
    issuer: "Komdigi — Digital Talent Scholarship",
    issueDate: "7 Desember 2025",
    description: "Pelatihan pengenalan arsitektur AI, implementasi data science pipeline, dan integrasi model cerdas.",
    imageUrl: "/assets/certs/cert6.jpg",
    featured: true,
    order: 6,
    createdAt: "2025-12-07T00:00:00.000Z",
    updatedAt: "2025-12-07T00:00:00.000Z"
  },
  {
    id: "cert-7",
    title: "Pertahanan Digital 101 untuk Individu & UMKM",
    issuer: "Komdigi × Indosat × Mastercard Global Cyber Alliance",
    issueDate: "7 Desember 2025",
    description: "Strategi praktis perlindungan data pribadi dan aset digital bisnis dari serangan siber umum.",
    imageUrl: "/assets/certs/cert7.jpg",
    featured: true,
    order: 7,
    createdAt: "2025-12-07T00:00:00.000Z",
    updatedAt: "2025-12-07T00:00:00.000Z"
  }
];

// Determine safe storage directory (use /tmp in serverless environments if cwd is read-only)
function getStoragePaths() {
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production";
  const localDataDir = path.join(process.cwd(), "data");
  const localDbFile = path.join(localDataDir, "db.json");

  // If local db exists or local directory is writable, use it
  if (fs.existsSync(localDbFile)) {
    return { dataDir: localDataDir, dbFile: localDbFile };
  }

  if (isServerless) {
    const tmpDataDir = path.join(os.tmpdir(), "daffa-portfolio-data");
    const tmpDbFile = path.join(tmpDataDir, "db.json");
    return { dataDir: tmpDataDir, dbFile: tmpDbFile };
  }

  return { dataDir: localDataDir, dbFile: localDbFile };
}

let inMemoryCache: DatabaseSchema | null = null;

function scanExistingMedia(): MediaItem[] {
  const mediaList: MediaItem[] = [];
  try {
    const publicDir = path.join(process.cwd(), "public");

    function scanDir(dir: string, basePublicPath: string) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const urlPath = `${basePublicPath}/${entry.name}`.replace(/\\/g, "/");
        if (entry.isDirectory()) {
          scanDir(fullPath, urlPath);
        } else if (/\.(webp|jpg|jpeg|png|svg|gif)$/i.test(entry.name)) {
          try {
            const stat = fs.statSync(fullPath);
            const ext = path.extname(entry.name).replace(".", "").toLowerCase();
            mediaList.push({
              id: `media-${Buffer.from(urlPath).toString("base64url").slice(0, 12)}`,
              filename: entry.name,
              url: urlPath,
              type: `image/${ext === "jpg" ? "jpeg" : ext}`,
              size: stat.size,
              alt: entry.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
              createdAt: stat.birthtime ? stat.birthtime.toISOString() : new Date().toISOString()
            });
          } catch {
            // ignore stat failure
          }
        }
      }
    }

    const assetsDir = path.join(publicDir, "assets");
    if (fs.existsSync(assetsDir)) {
      scanDir(assetsDir, "/assets");
    }

    const uploadsDir = path.join(publicDir, "uploads");
    if (fs.existsSync(uploadsDir)) {
      scanDir(uploadsDir, "/uploads");
    }
  } catch (e) {
    console.warn("Media scanning skipped in restricted environment:", e);
  }

  if (mediaList.length === 0) {
    // Return standard assets list as fallback
    return [
      { id: "media-photo", filename: "photo.jpg", url: "/assets/photo.jpg", type: "image/jpeg", size: 540000, createdAt: new Date().toISOString() },
      { id: "media-daffa", filename: "daffa.jpg", url: "/assets/daffa.jpg", type: "image/jpeg", size: 540000, createdAt: new Date().toISOString() },
      ...Array.from({ length: 7 }, (_, i) => ({
        id: `media-cert-${i + 1}`,
        filename: `cert${i + 1}.jpg`,
        url: `/assets/certs/cert${i + 1}.jpg`,
        type: "image/jpeg",
        size: 90000,
        createdAt: new Date().toISOString()
      }))
    ];
  }

  return mediaList;
}

function getDatabase(): DatabaseSchema {
  if (inMemoryCache) {
    return inMemoryCache;
  }

  const { dataDir, dbFile } = getStoragePaths();

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(dbFile)) {
      const initialMedia = scanExistingMedia();
      const schema: DatabaseSchema = {
        projects: INITIAL_PROJECTS,
        certificates: INITIAL_CERTIFICATES,
        media: initialMedia,
        profile: INITIAL_PROFILE,
        skills: INITIAL_SKILLS,
        version: 1
      };
      try {
        fs.writeFileSync(dbFile, JSON.stringify(schema, null, 2), "utf8");
      } catch (writeErr) {
        console.warn("Read-only filesystem detected, using in-memory store:", writeErr);
      }
      inMemoryCache = schema;
      return schema;
    }

    const raw = fs.readFileSync(dbFile, "utf8");
    const data = JSON.parse(raw) as DatabaseSchema;
    if (!data.media || data.media.length === 0) {
      data.media = scanExistingMedia();
      saveDatabase(data);
    }
    inMemoryCache = data;
    return data;
  } catch (err) {
    console.warn("Database disk access error, falling back to memory store:", err);
    const fallbackSchema: DatabaseSchema = {
      projects: INITIAL_PROJECTS,
      certificates: INITIAL_CERTIFICATES,
      media: scanExistingMedia(),
      profile: INITIAL_PROFILE,
      skills: INITIAL_SKILLS,
      version: 1
    };
    inMemoryCache = fallbackSchema;
    return fallbackSchema;
  }
}

function saveDatabase(data: DatabaseSchema): void {
  inMemoryCache = data;
  const { dataDir, dbFile } = getStoragePaths();

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const tempFile = `${dbFile}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tempFile, dbFile);
  } catch (err) {
    console.warn("Could not persist database to disk (serverless runtime memory active):", err);
  }
}

// ----------------- DB API -----------------

export const db = {
  // Projects
  getProjects(): Project[] {
    const data = getDatabase();
    return [...data.projects].sort((a, b) => a.order - b.order);
  },

  getProjectById(id: string): Project | undefined {
    const data = getDatabase();
    return data.projects.find((p) => p.id === id || p.slug === id);
  },

  createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
    const data = getDatabase();
    const id = project.slug || `proj-${Date.now()}`;
    const newProject: Project = {
      ...project,
      id,
      slug: project.slug || id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.projects.push(newProject);
    saveDatabase(data);
    return newProject;
  },

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const data = getDatabase();
    const index = data.projects.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return null;
    const updated = {
      ...data.projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    data.projects[index] = updated;
    saveDatabase(data);
    return updated;
  },

  deleteProject(id: string): boolean {
    const data = getDatabase();
    const initialLen = data.projects.length;
    data.projects = data.projects.filter((p) => p.id !== id && p.slug !== id);
    if (data.projects.length !== initialLen) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  reorderProjects(ids: string[]): Project[] {
    const data = getDatabase();
    ids.forEach((id, index) => {
      const p = data.projects.find((proj) => proj.id === id || proj.slug === id);
      if (p) p.order = index + 1;
    });
    saveDatabase(data);
    return this.getProjects();
  },

  // Certificates
  getCertificates(): Certificate[] {
    const data = getDatabase();
    return [...data.certificates].sort((a, b) => a.order - b.order);
  },

  getCertificateById(id: string): Certificate | undefined {
    const data = getDatabase();
    return data.certificates.find((c) => c.id === id);
  },

  createCertificate(cert: Omit<Certificate, "id" | "createdAt" | "updatedAt">): Certificate {
    const data = getDatabase();
    const newCert: Certificate = {
      ...cert,
      id: `cert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.certificates.push(newCert);
    saveDatabase(data);
    return newCert;
  },

  updateCertificate(id: string, updates: Partial<Certificate>): Certificate | null {
    const data = getDatabase();
    const index = data.certificates.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const updated = {
      ...data.certificates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    data.certificates[index] = updated;
    saveDatabase(data);
    return updated;
  },

  deleteCertificate(id: string): boolean {
    const data = getDatabase();
    const initialLen = data.certificates.length;
    data.certificates = data.certificates.filter((c) => c.id !== id);
    if (data.certificates.length !== initialLen) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  reorderCertificates(ids: string[]): Certificate[] {
    const data = getDatabase();
    ids.forEach((id, index) => {
      const c = data.certificates.find((cert) => cert.id === id);
      if (c) c.order = index + 1;
    });
    saveDatabase(data);
    return this.getCertificates();
  },

  // Media
  getMedia(): MediaItem[] {
    const data = getDatabase();
    return [...data.media].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addMedia(mediaItem: Omit<MediaItem, "id" | "createdAt">): MediaItem {
    const data = getDatabase();
    const newMedia: MediaItem = {
      ...mediaItem,
      id: `media-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    data.media.unshift(newMedia);
    saveDatabase(data);
    return newMedia;
  },

  deleteMedia(id: string): { success: boolean; error?: string } {
    const data = getDatabase();
    const target = data.media.find((m) => m.id === id);
    if (!target) return { success: false, error: "Media item not found" };

    // Check if media is in use by projects or certificates
    const isUsedInProject = data.projects.some(
      (p) => p.coverImage === target.url || p.galleryImages.includes(target.url)
    );
    const isUsedInCert = data.certificates.some((c) => c.imageUrl === target.url);
    const isUsedInProfile = data.profile.avatarUrl === target.url;

    if (isUsedInProject || isUsedInCert || isUsedInProfile) {
      return {
        success: false,
        error: `Cannot delete: this media is currently used in ${
          isUsedInProject ? "a project" : isUsedInCert ? "a certificate" : "your profile photo"
        }. Please remove its reference first.`
      };
    }

    data.media = data.media.filter((m) => m.id !== id);
    saveDatabase(data);

    // If it's an uploaded file in public/uploads, remove from disk
    if (target.url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", target.url.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn("Failed to delete physical file:", e);
        }
      }
    }

    return { success: true };
  },

  // Profile & Skills
  getProfile(): ProfileInfo {
    return getDatabase().profile;
  },

  updateProfile(updates: Partial<ProfileInfo>): ProfileInfo {
    const data = getDatabase();
    data.profile = { ...data.profile, ...updates };
    saveDatabase(data);
    return data.profile;
  },

  getSkills(): SkillGroup[] {
    return getDatabase().skills;
  },

  // Health Diagnostics
  getStudioHealth(): StudioHealth {
    const data = getDatabase();
    const projects = data.projects;
    const certs = data.certificates;
    const media = data.media;

    const brokenLinks: StudioHealth["brokenLinks"] = [];
    const missingDescriptions: StudioHealth["missingDescriptions"] = [];
    const missingImages: StudioHealth["missingImages"] = [];
    const recommendations: string[] = [];

    // Analyze projects
    for (const p of projects) {
      if (!p.fullDescription || p.fullDescription.trim().length < 40) {
        missingDescriptions.push({ id: p.id, type: "project", title: p.title });
      }
      if (!p.coverImage) {
        missingImages.push({ id: p.id, type: "project", title: p.title });
      }
      if (!p.githubUrl && p.featured) {
        recommendations.push(`Featured project "${p.title}" is missing a GitHub repository link.`);
      }
      if (p.technologies.length < 2) {
        recommendations.push(`Project "${p.title}" lists fewer than 2 technologies.`);
      }
      if (p.galleryImages.length <= 1) {
        recommendations.push(`Project "${p.title}" only has 1 preview image. Adding more screenshots will enhance presentation.`);
      }
    }

    // Analyze certificates
    for (const c of certs) {
      if (!c.description || c.description.trim().length < 20) {
        missingDescriptions.push({ id: c.id, type: "certificate", title: c.title });
      }
      if (!c.imageUrl) {
        missingImages.push({ id: c.id, type: "certificate", title: c.title });
      }
    }

    // InstanPage collaboration check
    const instanpage = projects.find((p) => p.slug === "instanpage" || p.id === "instanpage");
    if (instanpage && (!instanpage.collaborationDescription || !instanpage.teamSize)) {
      recommendations.push(`InstanPage should highlight its collaborative development with 2 teammates.`);
    }

    // Calculate Completeness Score (0-100)
    let score = 100;
    score -= missingDescriptions.length * 5;
    score -= missingImages.length * 10;
    score -= brokenLinks.length * 10;
    if (projects.filter((p) => p.featured).length === 0) score -= 15;
    if (certs.length === 0) score -= 15;
    score = Math.max(20, Math.min(100, score));

    return {
      totalProjects: projects.length,
      featuredProjects: projects.filter((p) => p.featured).length,
      totalCertificates: certs.length,
      totalMedia: media.length,
      completenessScore: score,
      brokenLinks,
      missingDescriptions,
      missingImages,
      aiRecommendations: recommendations
    };
  }
};
