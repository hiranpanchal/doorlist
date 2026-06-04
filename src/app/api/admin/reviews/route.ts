import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "admin";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const review = await prisma.review.create({ data: body });
  return NextResponse.json(review, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const { id, ...data } = body;
  const review = await prisma.review.update({ where: { id }, data });
  return NextResponse.json(review);
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await request.json();
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
