import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json();

  const required = [
    "title", "description", "propertyType", "address", "city",
    "county", "postcode", "price", "bedrooms", "bathrooms",
    "availableFrom",
  ];

  for (const field of required) {
    if (body[field] === undefined || body[field] === "") {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const property = await prisma.property.create({
    data: {
      title: body.title,
      description: body.description,
      propertyType: body.propertyType,
      address: body.address,
      city: body.city,
      county: body.county,
      postcode: body.postcode,
      price: parseInt(body.price),
      bedrooms: parseInt(body.bedrooms),
      bathrooms: parseInt(body.bathrooms),
      furnished: body.furnished || "unfurnished",
      petFriendly: body.petFriendly === true,
      dssAccepted: body.dssAccepted === true,
      parking: body.parking === true,
      garden: body.garden === true,
      fireplace: body.fireplace === true,
      studentFriendly: body.studentFriendly === true,
      familiesAllowed: body.familiesAllowed !== false,
      smokersAllowed: body.smokersAllowed === true,
      billsIncluded: body.billsIncluded === true,
      deposit: parseInt(body.deposit) || 0,
      minTenancy: parseInt(body.minTenancy) || 6,
      epc: body.epc || "C",
      availableFrom: body.availableFrom,
      latitude: body.latitude ? parseFloat(body.latitude) : null,
      longitude: body.longitude ? parseFloat(body.longitude) : null,
      images: body.images || "",
      landlordName: user.name,
      landlordEmail: user.email,
      landlordPhone: user.phone,
      status: "draft",
      userId: user.id,
    },
  });

  return NextResponse.json({ id: property.id }, { status: 201 });
}
