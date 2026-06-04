import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "admin";
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    if (s.key === "stripe_secret_key") {
      map[s.key] = maskKey(s.value);
    } else {
      map[s.key] = s.value;
    }
  }

  return NextResponse.json(map);
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const keys = ["stripe_secret_key", "stripe_publishable_key", "stripe_webhook_secret", "stripe_mode"];

  for (const key of keys) {
    if (body[key] !== undefined) {
      const value = body[key];
      if (key === "stripe_secret_key" && value.includes("•")) continue;

      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { id: key, key, value },
      });
    }
  }

  return NextResponse.json({ success: true });
}

function maskKey(key: string): string {
  if (!key || key.length < 12) return key;
  return key.substring(0, 7) + "•".repeat(20) + key.substring(key.length - 4);
}
