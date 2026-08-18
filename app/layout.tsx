import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://daffa-portfolio-sigma.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Muhamad Daffa Permana — Junior Software Developer",
  description:
    "Portfolio resmi Muhamad Daffa Permana, Junior Software Developer dan siswa Rekayasa Perangkat Lunak di SMK Negeri 1 Cisarua. Berfokus pada Software Development dan Back-End Development (Node.js, Express, Next.js, Python, PHP, MySQL, Prisma, Docker).",
  keywords: [
    "Muhamad Daffa Permana",
    "Muhamad Daffa Permana SMKN 1 Cisarua",
    "Junior Software Developer",
    "SMK Negeri 1 Cisarua",
    "Software Development",
    "Back-End Development",
    "Daffa-exp",
    "Portfolio Developer Indonesia"
  ],
  authors: [{ name: "Muhamad Daffa Permana", url: siteUrl }],
  creator: "Muhamad Daffa Permana",
  publisher: "Muhamad Daffa Permana",
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    title: "Muhamad Daffa Permana — Junior Software Developer",
    description:
      "Portfolio resmi Muhamad Daffa Permana, Junior Software Developer & siswa SMK Negeri 1 Cisarua berfokus pada Software Development & Back-End Development.",
    url: siteUrl,
    siteName: "Muhamad Daffa Permana Portfolio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/assets/photo.jpg",
        width: 800,
        height: 800,
        alt: "Muhamad Daffa Permana — Junior Software Developer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhamad Daffa Permana — Junior Software Developer",
    description:
      "Junior Software Developer & siswa SMK Negeri 1 Cisarua berfokus pada Software Development & Back-End Development.",
    images: ["/assets/photo.jpg"]
  },
  verification: {
    google: "googled2ff0555a10011c6"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  // Structured Data (JSON-LD) for Person & Portfolio Entity Identity
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Muhamad Daffa Permana",
    "alternateName": ["Daffa", "Daffa Permana"],
    "jobTitle": "Junior Software Developer",
    "description":
      "Junior Software Developer dan siswa Rekayasa Perangkat Lunak di SMK Negeri 1 Cisarua berfokus pada Software Development dan Back-End Development.",
    "url": siteUrl,
    "email": "mailto:permanadaffa89@gmail.com",
    "image": `${siteUrl}/assets/photo.jpg`,
    "sameAs": ["https://github.com/Daffa-exp"],
    "knowsAbout": [
      "Software Development",
      "Back-End Development",
      "HTML",
      "CSS",
      "JavaScript",
      "Python",
      "PHP",
      "Dart",
      "TypeScript",
      "Next.js",
      "React",
      "Express.js",
      "Node.js",
      "Laravel",
      "Flutter",
      "Flask",
      "Tailwind CSS",
      "MySQL",
      "Firebase",
      "Supabase",
      "Prisma",
      "Docker",
      "Git"
    ],
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "SMK Negeri 1 Cisarua",
        "description": "Rekayasa Perangkat Lunak (2024 - Sekarang)"
      },
      {
        "@type": "EducationalOrganization",
        "name": "MTs As Shofa Cisarua",
        "description": "Pendidikan Menengah (2021 - 2024)"
      },
      {
        "@type": "EducationalOrganization",
        "name": "SD Negeri Kancah",
        "description": "Pendidikan Dasar (2015 - 2021)"
      }
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Muhamad Daffa Permana Portfolio",
    "url": siteUrl,
    "author": {
      "@type": "Person",
      "name": "Muhamad Daffa Permana"
    }
  };

  const projectsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Featured Software Projects by Muhamad Daffa Permana",
    "itemListElement": [
      {
        "@type": "SoftwareApplication",
        "position": 1,
        "name": "Foodmart",
        "applicationCategory": "Full-Stack Web Application",
        "operatingSystem": "Web",
        "url": "https://food-mart-ty91.vercel.app/",
        "description":
          "Website pemesanan makanan online dengan katalog menu, promo, sistem keranjang, dan manajemen pesanan. REST API serverless Vercel.",
        "author": {
          "@type": "Person",
          "name": "Muhamad Daffa Permana"
        }
      },
      {
        "@type": "SoftwareApplication",
        "position": 2,
        "name": "InstanPage",
        "applicationCategory": "Full-Stack Web Application",
        "operatingSystem": "Web",
        "url": "https://instant-page-full-system.vercel.app/",
        "description":
          "Aplikasi pembuat landing page instan untuk UMKM & campaign digital. Dikembangkan secara kolaboratif dalam tim 3 orang.",
        "author": {
          "@type": "Person",
          "name": "Muhamad Daffa Permana"
        }
      },
      {
        "@type": "SoftwareApplication",
        "position": 3,
        "name": "Pariwisata Bandung Barat",
        "applicationCategory": "Web Application",
        "operatingSystem": "Web",
        "url": "https://soft-florentine-811c65.netlify.app/",
        "description":
          "Platform informasi dan rekomendasi destinasi wisata di Kabupaten Bandung Barat.",
        "author": {
          "@type": "Person",
          "name": "Muhamad Daffa Permana"
        }
      }
    ]
  };

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
