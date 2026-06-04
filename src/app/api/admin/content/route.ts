import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

// All homepage content keys with defaults
export const CONTENT_DEFAULTS: Record<string, string> = {
  hero_badge: "No agency fees · No hidden costs",
  hero_title_1: "Find your perfect",
  hero_title_2: "rental home.",
  hero_subtitle: "The UK's marketplace for private landlords and tenants. Just great homes, direct.",
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
  cta_subtitle: "Whether you're a landlord looking for quality tenants or a tenant searching for your next home, Doorlist has you covered.",
};

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await prisma.setting.findMany({
    where: { key: { startsWith: "hero_" } },
  });

  // Also get all content keys
  const allSettings = await prisma.setting.findMany({
    where: {
      key: {
        in: Object.keys(CONTENT_DEFAULTS),
      },
    },
  });

  const result: Record<string, string> = { ...CONTENT_DEFAULTS };
  for (const s of allSettings) {
    result[s.key] = s.value;
  }

  return NextResponse.json(result);
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  for (const [key, value] of Object.entries(body)) {
    if (key in CONTENT_DEFAULTS) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: value as string },
        create: { id: key, key, value: value as string },
      });
    }
  }

  return NextResponse.json({ success: true });
}
