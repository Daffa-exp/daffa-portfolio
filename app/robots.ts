import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/daffa-studio", "/daffa-studio/*", "/api/studio/*", "/api/auth/*"]
      }
    ],
    sitemap: "https://daffa-portfolio.vercel.app/sitemap.xml"
  };
}
