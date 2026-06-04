import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public: get published reviews
export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

// Public: submit a review (unpublished by default)
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || !body.body || !body.rating) {
    return NextResponse.json({ error: "Name, review, and rating are required" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      name: body.name,
      role: body.role || "Tenant",
      rating: Math.min(5, Math.max(1, parseInt(body.rating))),
      title: body.title || "",
      body: body.body,
      published: false, // Requires admin approval
    },
  });

  return NextResponse.json(review, { status: 201 });
}
