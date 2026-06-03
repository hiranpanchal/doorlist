import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { propertyId, name, email, phone, message } = await request.json();

  if (!propertyId || !name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { userId: true, landlordEmail: true, landlordName: true, title: true },
  });

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  if (!property.userId) {
    return NextResponse.json({ error: "No landlord linked" }, { status: 400 });
  }

  await prisma.message.create({
    data: {
      propertyId,
      landlordId: property.userId,
      senderName: name,
      senderEmail: email,
      senderPhone: phone || "",
      body: message,
    },
  });

  // TODO: Send email notification to landlord via Resend/SendGrid

  return NextResponse.json({ success: true }, { status: 201 });
}
