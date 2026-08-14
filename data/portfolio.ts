export type Project = {
  id: string;
  index?: string;
  name: string;
  tagline: string;
  desc: string;
  stack: string[];
  images: string[];
  demo?: string;
  featured?: boolean;
  category?: string;
};

export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  img: string;
};

const imgs = (slug: string, count: number, ext = ".webp") =>
  Array.from({ length: count }, (_, i) => `/assets/projects/${slug}/${i + 1}${ext}`);


export const featuredProjects: Project[] = [
  {
    id: "foodmart", index: "01", name: "Foodmart", category: "FULL-STACK WEB",
    tagline: "Platform pemesanan makanan online",
    desc: "Website pemesanan makanan dengan katalog menu, promo, sistem keranjang, pembayaran, dan dashboard admin. Frontend dan backend dipisah sebagai service independen.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Vercel"],
    images: imgs("foodmart", 3),
    demo: "https://food-mart-ty91.vercel.app/", featured: true
  },
  {
    id: "instanpage", index: "02", name: "InstanPage", category: "FULL-STACK WEB",
    tagline: "Pembuat landing page instan untuk UMKM & campaign",
    desc: "Aplikasi untuk membuat landing page promosi dengan template siap pakai untuk produk, jasa, event, kelas, dan campaign. Dibangun sebagai aplikasi full-stack dengan database dan testing.",
    stack: ["Next.js", "React", "Express.js", "MySQL", "Tailwind CSS"],
    images: imgs("instanpage", 1),
    demo: "https://instant-page-full-system.vercel.app/", featured: true
  },
  {
    id: "pariwisata", index: "03", name: "Pariwisata", category: "WEB EXPERIENCE",
    tagline: "Website eksplorasi wisata & booking",
    desc: "Website pariwisata dengan destinasi, kuliner, journal, galeri, pemesanan tiket, dan booking hotel. Dibangun sebagai eksplorasi web menggunakan HTML, CSS, dan JavaScript.",
    stack: ["HTML", "CSS", "JavaScript"],
    images: imgs("pariwisata", 7),
    demo: "https://soft-florentine-811c65.netlify.app/", featured: true
  }
];

export const moreProjects: Project[] = [
  { id:"kaskelas", name:"Kas Kelas", category:"DESKTOP APP", tagline:"Sistem manajemen keuangan kelas digital", desc:"Aplikasi desktop untuk mengelola kas kelas, tunggakan dan kredit siswa, grafik analitik keuangan, pembayaran QR code, serta export laporan.", stack:["Electron","Node.js","Express"], images:imgs("kaskelas",6) },
  { id:"hubin", name:"Hubin", category:"DESKTOP APP", tagline:"Pengelolaan hubungan industri sekolah", desc:"Aplikasi desktop untuk mengelola data siswa PKL, kunjungan industri, dan MoU sekolah, lengkap dengan alur pengelolaan data.", stack:["Electron","Express"], images:imgs("hubin",3) },
  { id:"exam", name:"Exam Monitoring System", category:"AI / COMPUTER VISION", tagline:"Pemantauan ujian berbasis AI", desc:"Sistem monitoring ujian yang memanfaatkan deteksi wajah untuk membantu pemantauan peserta secara real-time.", stack:["Python","Flask","OpenCV","MediaPipe"], images:imgs("exam",1) },
  { id:"galerifoto", name:"Galeri Foto Native", category:"WEB APP", tagline:"Galeri foto dengan sistem like & profil", desc:"Aplikasi web galeri foto dengan autentikasi pengguna, upload foto, sistem like berbasis AJAX, dan halaman profil pengguna.", stack:["PHP","MySQL","AJAX"], images:imgs("galerifoto",4) },
  { id:"phonebook", name:"Web Phone Book", category:"WEB APP", tagline:"Manajemen kontak berbasis web", desc:"Aplikasi pengelolaan kontak dengan login, tambah dan lihat data kontak lengkap dengan foto profil.", stack:["PHP","MySQL"], images:imgs("phonebook",5) },
  { id:"webwedding", name:"Web Wedding Invitation", category:"WEB EXPERIENCE", tagline:"Undangan pernikahan digital", desc:"Undangan pernikahan digital interaktif dengan animasi pembuka dan tampilan modern.", stack:["Next.js","TypeScript","Tailwind CSS"], images:imgs("webwedding",6) },
  { id:"mobilelms", name:"Mobile LMS", category:"MOBILE APP", tagline:"Aplikasi pembelajaran online sederhana", desc:"Aplikasi pembelajaran dengan kategori jenjang pendidikan, daftar kelas, dan sistem poin belajar.", stack:["Flutter","Dart","JavaScript","Tailwind CSS"], images:imgs("mobilelms",2) },
  { id:"jersey", name:"Pendataan Pembayaran DP", category:"UTILITY WEB", tagline:"Tools pencatatan pembayaran jersey kelas", desc:"Tools ringan untuk mencatat pembayaran DP dan pelunasan, dengan progress pembayaran per orang.", stack:["HTML","JavaScript"], images:imgs("jersey",2) },
  { id:"webpaslon", name:"Web Paslon OSIS", category:"WEB EXPERIENCE", tagline:"Halaman pemilihan Ketua & Wakil OSIS", desc:"Halaman voting pemilihan Ketua dan Wakil OSIS dengan profil kandidat dan penghitungan suara.", stack:["HTML","JavaScript"], images:imgs("webpaslon",2) },
  { id:"webbolu", name:"Bolu Pinky", category:"E-COMMERCE", tagline:"E-commerce kue rumahan dengan live chat", desc:"Website e-commerce bakery dengan katalog produk, keranjang, checkout, dan live chat real-time.", stack:["Supabase","JavaScript","Realtime Chat"], images:imgs("webbolu",5) },
  { id:"girlfriend", name:"Girlfriend", category:"INTERACTIVE WEB", tagline:"Eksperimen web interaktif", desc:"Proyek eksplorasi antarmuka interaktif dengan visual dan animasi yang menjadi bagian dari kumpulan karya personal.", stack:["HTML","CSS","JavaScript"], images:imgs("girlfriend",3) }
];

export const certificates: Certificate[] = [
  { title:"Dasar dan Penggunaan Generatif AI", issuer:"Codepolitan × AI Opportunity Fund Asia Pacific", date:"22 April 2026", img:"/assets/certs/cert1.jpg" },
  { title:"Introduction to Information Security", issuer:"Cyber Academy — Cyber Army Indonesia", date:"8 Mei 2025", img:"/assets/certs/cert2.jpg" },
  { title:"AI Ready ASEAN", issuer:"ASEAN Foundation × Google.org", date:"22 Mei 2026", img:"/assets/certs/cert3.jpg" },
  { title:"Belajar Dasar AI", issuer:"Dicoding Indonesia", date:"2 November 2025", img:"/assets/certs/cert4.jpg" },
  { title:"Ethical Hacker for Dummies", issuer:"Komdigi — Digital Talent Scholarship", date:"7 Desember 2025", img:"/assets/certs/cert5.jpg" },
  { title:"AI Engineer for Milenial", issuer:"Komdigi — Digital Talent Scholarship", date:"7 Desember 2025", img:"/assets/certs/cert6.jpg" },
  { title:"Pertahanan Digital 101 untuk Individu & UMKM", issuer:"Komdigi × Indosat × Mastercard Global Cyber Alliance", date:"7 Desember 2025", img:"/assets/certs/cert7.jpg" }
];

export const skills = [
  { group:"PROGRAMMING", items:["HTML","CSS","JavaScript","Python","PHP","Dart"] },
  { group:"FRAMEWORKS / TOOLS", items:["Next.js","React","Express.js","Node.js","Laravel","Flutter","Flask","Tailwind CSS"] },
  { group:"DATABASE", items:["MySQL","Firebase","Supabase"] },
  { group:"DEVELOPMENT", items:["AI-assisted Development"] }
];

export const allProjects = [...featuredProjects, ...moreProjects];
