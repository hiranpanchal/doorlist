import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doorlist-lpij.vercel.app";

  const properties = await prisma.property.findMany({
    where: { status: { in: ["available", "active"] } },
    select: { id: true, updatedAt: true },
  });

  const propertyUrls = properties.map((p) => ({
    url: `${baseUrl}/properties/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/login`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/register`, changeFrequency: "monthly" as const, priority: 0.5 },
    ...propertyUrls,
  ];
}
