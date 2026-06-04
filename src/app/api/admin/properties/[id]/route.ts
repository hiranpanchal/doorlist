import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "admin";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  // Activate listing for free (admin override)
  if (body.activate) {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 30);

    const property = await prisma.property.update({
      where: { id },
      data: {
        status: "active",
        paidAt: now,
        expiresAt,
      },
    });
    return NextResponse.json(property);
  }

  // Toggle featured
  if (body.featured !== undefined) {
    const property = await prisma.property.update({
      where: { id },
      data: { featured: body.featured },
    });
    return NextResponse.json(property);
  }

  return NextResponse.json({ error: "No action specified" }, { status: 400 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.payment.deleteMany({ where: { propertyId: id } });
  await prisma.message.deleteMany({ where: { propertyId: id } });
  await prisma.property.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
