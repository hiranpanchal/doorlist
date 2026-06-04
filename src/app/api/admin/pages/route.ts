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

  const pages = await prisma.page.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json(pages);
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { id, ...data } = body;

  const page = await prisma.page.upsert({
    where: { id },
    update: data,
    create: { id, slug: id, ...data },
  });

  return NextResponse.json(page);
}
