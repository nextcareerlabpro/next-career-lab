import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin"],
      },
    ],
    sitemap: "https://upgradeyourresume.com/sitemap.xml",
    host: "https://upgradeyourresume.com",
  };
}
