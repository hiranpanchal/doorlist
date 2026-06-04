import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "admin";
}

export const SEO_DEFAULTS: Record<string, string> = {
  // General
  site_title: "Doorlist — Every door, listed.",
  site_description: "The UK's marketplace for private landlords. List your property or find your perfect rental home — no agency fees, just great homes direct.",
  site_keywords: "rental properties, lettings, landlord, tenant, property listing, UK rentals, no agency fees",
  site_url: "",
  // Open Graph / Facebook
  og_title: "Doorlist — Find Your Perfect Rental Home",
  og_description: "The UK's marketplace for private landlords and tenants. Just great homes, direct.",
  og_image: "",
  og_type: "website",
  fb_app_id: "",
  // Twitter / X
  twitter_card: "summary_large_image",
  twitter_title: "Doorlist — Find Your Perfect Rental Home",
  twitter_description: "The UK's marketplace for private landlords and tenants. No agency fees, just great homes.",
  twitter_image: "",
  twitter_handle: "",
  // Verification
  google_verification: "",
  bing_verification: "",
  facebook_domain_verification: "",
  // Analytics
  google_analytics_id: "",
  facebook_pixel_id: "",
  // Indexing
  robots_index: "true",
  robots_follow: "true",
  canonical_url: "",
  // Structured Data
  schema_org_name: "Doorlist",
  schema_org_logo: "",
  schema_org_phone: "",
  schema_org_email: "",
  schema_org_address: "",
};

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await prisma.setting.findMany({
    where: { key: { in: Object.keys(SEO_DEFAULTS) } },
  });

  const result = { ...SEO_DEFAULTS };
  for (const s of settings) {
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
    if (key in SEO_DEFAULTS) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: value as string },
        create: { id: key, key, value: value as string },
      });
    }
  }

  return NextResponse.json({ success: true });
}
