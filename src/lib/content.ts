import { prisma } from "@/lib/prisma";

const DEFAULTS: Record<string, string> = {
  hero_badge: "No agency fees · No hidden costs",
  hero_title_1: "Find your perfect",
  hero_title_2: "rental home.",
  hero_subtitle: "The UK’s marketplace for private landlords and tenants. Just great homes, direct.",
  hero_image: "",
  hero_overlay_opacity: "85",
  hero_gradient_from: "#06182b",
  hero_gradient_to: "#0e3558",
  hero_accent_color: "#3b7dd8",
  trust_1: "Verified Listings",
  trust_2: "Just £29.99/listing",
  trust_3: "Direct to Landlord",
  featured_eyebrow: "[ 03 ] The Listing",
  featured_title_1: "Listings that",
  featured_title_2: "look like",
  featured_title_3: "somebody cared.",
  pricing_eyebrow: "[ 04 ] Pricing",
  pricing_title_1: "Free for one door.",
  pricing_title_2: "Fair for the rest.",
  pricing_subtitle: "Three plans, no per-applicant fees, no surprise charges, no contracts to escape from.",
  cta_title: "Ready to get started?",
  cta_subtitle: "Whether you’re a landlord looking for quality tenants or a tenant searching for your next home, Doorlist has you covered.",
};

export async function getContent(): Promise<Record<string, string>> {
  const result = { ...DEFAULTS };

  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: Object.keys(DEFAULTS) } },
    });
    for (const s of settings) {
      result[s.key] = s.value;
    }
  } catch {
    // If DB not available, use defaults
  }

  return result;
}
