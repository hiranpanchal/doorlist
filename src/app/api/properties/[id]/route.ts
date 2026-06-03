import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.property.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(property);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property || property.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or not authorized" }, { status: 403 });
  }

  const body = await request.json();

  const updated = await prisma.property.update({
    where: { id },
    data: {
      title: body.title ?? property.title,
      description: body.description ?? property.description,
      propertyType: body.propertyType ?? property.propertyType,
      address: body.address ?? property.address,
      city: body.city ?? property.city,
      county: body.county ?? property.county,
      postcode: body.postcode ?? property.postcode,
      price: body.price ? parseInt(body.price) : property.price,
      bedrooms: body.bedrooms !== undefined ? parseInt(body.bedrooms) : property.bedrooms,
      bathrooms: body.bathrooms !== undefined ? parseInt(body.bathrooms) : property.bathrooms,
      furnished: body.furnished ?? property.furnished,
      petFriendly: body.petFriendly ?? property.petFriendly,
      dssAccepted: body.dssAccepted ?? property.dssAccepted,
      parking: body.parking ?? property.parking,
      garden: body.garden ?? property.garden,
      fireplace: body.fireplace ?? property.fireplace,
      studentFriendly: body.studentFriendly ?? property.studentFriendly,
      familiesAllowed: body.familiesAllowed ?? property.familiesAllowed,
      smokersAllowed: body.smokersAllowed ?? property.smokersAllowed,
      billsIncluded: body.billsIncluded ?? property.billsIncluded,
      deposit: body.deposit !== undefined ? parseInt(body.deposit) : property.deposit,
      minTenancy: body.minTenancy !== undefined ? parseInt(body.minTenancy) : property.minTenancy,
      epc: body.epc ?? property.epc,
      availableFrom: body.availableFrom ?? property.availableFrom,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property || property.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or not authorized" }, { status: 403 });
  }

  await prisma.payment.deleteMany({ where: { propertyId: id } });
  await prisma.property.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
