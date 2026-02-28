import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/data";

const BASE_URL = "https://auntysebis.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pieceSlugs = getAllSlugs();

  const pieceUrls = pieceSlugs.map((slug) => ({
    url: `${BASE_URL}/pieces/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/globe`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...pieceUrls,
  ];
}
