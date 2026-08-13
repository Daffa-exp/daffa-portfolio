// ===================================================================
// Data diambil dari CV, screenshot struktur folder, dan tangkapan
// layar proyek yang disediakan. Tidak ada data yang dikarang.
// ===================================================================

const FEATURED_PROJECTS = [
  {
    index: "01",
    name: "FoodMart",
    tagline: "Platform pemesanan makanan online",
    desc: "Website pemesanan makanan dengan katalog menu, promo, dan sistem keranjang. Frontend dan backend dipisah sebagai dua service independen, backend menyediakan REST API yang di-deploy sebagai serverless function di Vercel.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Vercel"],
    stackNote: "Stack diverifikasi dari struktur folder frontend/ (next.config, tailwind.config, app/) dan backend/ (api/, src/, vercel.json).",
    demo: "https://food-mart-ty91.vercel.app/",
    images: ["assets/projects/foodmart/1.jpg", "assets/projects/foodmart/2.jpg", "assets/projects/foodmart/3.jpg"]
  },
  {
    index: "02",
    name: "InstanPage",
    tagline: "Pembuat landing page instan untuk UMKM & campaign",
    desc: "Aplikasi untuk membuat landing page promosi secara cepat dari template siap pakai — untuk kebutuhan produk, jasa, event, kelas, hingga campaign. Dibangun dengan arsitektur full-stack modern lengkap dengan database dan testing.",
    stack: ["Next.js", "Prisma", "Docker", "pnpm", "Vitest"],
    stackNote: "Stack diverifikasi dari struktur folder: app/, prisma/, docker-compose, Dockerfile, pnpm-lock, vitest.config.",
    demo: "https://instant-page-full-system.vercel.app/",
    images: ["assets/projects/instanpage/1.jpg"]
  },
  {
    index: "03",
    name: "Pariwisata",
    tagline: "Website eksplorasi wisata & booking di Jakarta",
    desc: "Website pariwisata dengan fitur pemesanan tiket dan booking hotel, lengkap dengan halaman destinasi, kuliner, journal, dan galeri. Dibangun murni dengan HTML, CSS, dan JavaScript tanpa framework.",
    stack: ["HTML", "CSS", "JavaScript"],
    stackNote: "Stack diverifikasi dari struktur folder: seluruh file berupa .html/.js/.css tanpa package manager atau framework.",
    demo: "https://soft-florentine-811c65.netlify.app/",
    images: ["assets/projects/pariwisata/1.jpg", "assets/projects/pariwisata/2.jpg", "assets/projects/pariwisata/3.jpg"]
  }
];

const MORE_PROJECTS = [
  {
    name: "Kas Kelas",
    tagline: "Sistem manajemen keuangan kelas digital",
    desc: "Aplikasi desktop untuk mengelola kas kelas: tunggakan & kredit per siswa, grafik analitik keuangan real-time, pembayaran via QR code, dan export laporan ke Excel/CSV. Dibuat untuk SMKN 1 Cisarua.",
    stack: ["Electron", "Node.js", "Express"],
    stackNote: "Diverifikasi dari struktur folder: electron/, frontend/, backend/, database/.",
    images: ["assets/projects/kaskelas/1.jpg"]
  },
  {
    name: "Hubin",
    tagline: "Aplikasi pengelolaan hubungan industri",
    desc: "Aplikasi desktop untuk mengelola data siswa PKL, kunjungan industri, dan MoU sekolah, lengkap dengan fitur import-export Excel.",
    stack: ["Electron", "Express"],
    stackNote: "Teknologi dikonfirmasi langsung oleh pemilik proyek: Electron & Express.",
    images: ["assets/projects/hubin/1.jpg"]
  },
  {
    name: "Exam Monitoring System",
    tagline: "Pemantauan ujian berbasis AI",
    desc: "Sistem monitoring ujian yang mendeteksi keberadaan dan posisi wajah peserta secara real-time menggunakan face landmark detection, untuk membantu mengurangi kecurangan saat ujian online.",
    stack: ["Python", "Flask", "OpenCV", "MediaPipe"],
    stackNote: "Diverifikasi dari struktur folder: templates/, static/, face_landmarker model, virtual environment Python.",
    images: ["assets/projects/exam/1.jpg"]
  },
  {
    name: "Galeri Foto Native",
    tagline: "Galeri foto dengan sistem like & profil",
    desc: "Aplikasi web galeri foto dengan autentikasi pengguna, upload foto, sistem like berbasis AJAX, dan halaman profil masing-masing pengguna.",
    stack: ["PHP", "MySQL", "AJAX"],
    stackNote: "Diverifikasi dari struktur folder: file .php native (login, register, upload, like_ajax) tanpa framework.",
    images: ["assets/projects/galerifoto/1.jpg"]
  },
  {
    name: "Web Phone Book",
    tagline: "Manajemen kontak berbasis web",
    desc: "Aplikasi pengelolaan kontak dengan sistem login, tambah dan lihat data kontak lengkap dengan foto profil masing-masing kontak.",
    stack: ["PHP", "MySQL"],
    stackNote: "Diverifikasi dari struktur folder: db_phonebook.sql, index.php, koneksi.php, login/register/logout.php.",
    images: ["assets/projects/phonebook/1.jpg"]
  },
  {
    name: "Web Wedding Invitation",
    tagline: "Undangan pernikahan digital",
    desc: "Undangan pernikahan digital interaktif dengan animasi pembuka dan tampilan modern, dibangun sebagai proyek eksplorasi Next.js.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    stackNote: "Diverifikasi dari struktur folder: app/, components/, next.config, tailwind.config, tsconfig.",
    images: ["assets/projects/webwedding/1.jpg"]
  },
  {
    name: "Mobile LMS — Ruang Belajar",
    tagline: "Aplikasi pembelajaran online sederhana",
    desc: "Aplikasi mobile pembelajaran dengan kategori berdasarkan jenjang pendidikan (SD hingga Mahasiswa), daftar kelas, dan sistem poin belajar.",
    stack: ["Flutter", "Dart", "Tailwind CSS"],
    stackNote: "Teknologi dikonfirmasi langsung oleh pemilik proyek: Flutter, JS, HTML, Tailwind CSS.",
    images: ["assets/projects/mobilelms/1.jpg"]
  },
  {
    name: "Pendataan Pembayaran DP",
    tagline: "Tools pencatatan pembayaran jersey kelas",
    desc: "Tools ringan untuk mencatat pembayaran DP dan pelunasan, dengan progress pembayaran per orang dan export data ke Excel.",
    stack: ["HTML", "JavaScript"],
    stackNote: "Diverifikasi dari struktur folder: satu file index.html mandiri dengan node_modules pendukung.",
    images: ["assets/projects/jersey/1.jpg"]
  },
  {
    name: "Web Paslon OSIS",
    tagline: "Halaman pemilihan Ketua & Wakil OSIS",
    desc: "Halaman voting untuk pemilihan Ketua dan Wakil OSIS SMKN 1 Cisarua periode 2026–2027, menampilkan profil kandidat dan penghitungan suara.",
    stack: ["HTML", "JavaScript"],
    stackNote: "Diverifikasi dari file proyek: index.html mandiri berbasis client-side.",
    images: ["assets/projects/webpaslon/1.jpg"]
  },
  {
    name: "Bolu Pinky",
    tagline: "E-commerce kue rumahan dengan live chat",
    desc: "Website e-commerce bakery bertema pastel pink dengan katalog produk, keranjang, checkout, serta live chat real-time antara customer dan admin.",
    stack: ["Supabase", "JavaScript", "Realtime Chat"],
    stackNote: "Diverifikasi dari struktur project: autentikasi, database, dan chat realtime menggunakan Supabase.",
    images: ["assets/projects/webbolu/1.jpg"]
  }
];

const CERTIFICATES = [
  {
    title: "Dasar dan Penggunaan Generatif AI",
    issuer: "Codepolitan × AI Opportunity Fund Asia Pacific",
    date: "22 April 2026",
    img: "assets/certs/cert1.jpg"
  },
  {
    title: "Introduction to Information Security",
    issuer: "Cyber Academy — Cyber Army Indonesia",
    date: "8 Mei 2025",
    img: "assets/certs/cert2.jpg"
  },
  {
    title: "AI Ready ASEAN",
    issuer: "ASEAN Foundation × Google.org",
    date: "22 Mei 2026",
    img: "assets/certs/cert3.jpg"
  },
  {
    title: "Belajar Dasar AI",
    issuer: "Dicoding Indonesia",
    date: "2 November 2025",
    img: "assets/certs/cert4.jpg"
  },
  {
    title: "Ethical Hacker for Dummies",
    issuer: "Komdigi — Digital Talent Scholarship",
    date: "7 Desember 2025",
    img: "assets/certs/cert5.jpg"
  },
  {
    title: "AI Engineer for Milenial",
    issuer: "Komdigi — Digital Talent Scholarship",
    date: "7 Desember 2025",
    img: "assets/certs/cert6.jpg"
  },
  {
    title: "Pertahanan Digital 101 untuk Individu & UMKM",
    issuer: "Komdigi × Indosat × Mastercard Global Cyber Alliance",
    date: "7 Desember 2025",
    img: "assets/certs/cert7.jpg"
  }
];
