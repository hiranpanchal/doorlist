import { prisma } from "@/lib/prisma";

const SEO_KEYS = [
  "site_title", "site_description", "site_keywords", "site_url",
  "og_title", "og_description", "og_image", "og_type", "fb_app_id",
  "twitter_card", "twitter_title", "twitter_description", "twitter_image", "twitter_handle",
  "google_verification", "bing_verification", "facebook_domain_verification",
  "google_analytics_id", "facebook_pixel_id",
  "robots_index", "robots_follow", "canonical_url",
  "schema_org_name", "schema_org_logo", "schema_org_phone", "schema_org_email", "schema_org_address",
];

const DEFAULTS: Record<string, string> = {
  site_title: "Doorlist — Every door, listed.",
  site_description: "The UK's marketplace for private landlords. List your property or find your perfect rental home.",
  robots_index: "true",
  robots_follow: "true",
  og_type: "website",
  twitter_card: "summary_large_image",
  schema_org_name: "Doorlist",
};

export async function getSeoSettings(): Promise<Record<string, string>> {
  const result = { ...DEFAULTS };
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: SEO_KEYS } },
    });
    for (const s of settings) {
      result[s.key] = s.value;
    }
  } catch {
    // Use defaults
  }
  return result;
}
