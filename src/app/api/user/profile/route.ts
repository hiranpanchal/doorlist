import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, phone: true,
      company: true, bio: true, logo: true, website: true,
      city: true, county: true,
    },
  });

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.email && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.company !== undefined && { company: body.company }),
      ...(body.bio !== undefined && { bio: body.bio }),
      ...(body.logo !== undefined && { logo: body.logo }),
      ...(body.website !== undefined && { website: body.website }),
      ...(body.city !== undefined && { city: body.city }),
      ...(body.county !== undefined && { county: body.county }),
    },
    select: {
      id: true, name: true, email: true, phone: true,
      company: true, bio: true, logo: true, website: true,
      city: true, county: true,
    },
  });

  return NextResponse.json(user);
}
